/**
 * IDF (Intensity-Duration-Frequency) & Peak Flow Calculator
 * In accordance with:
 * - MSMA 2nd Edition (2012) — Department of Irrigation and Drainage (DID/JPS)
 *   - Chapter 13: Design Rainstorm (Eq. 13.2 polynomial & Eq. 13.3 / Table 13.3 short duration)
 *   - Appendix 13.A: High ARI & Low ARI equations (λ, κ, θ, η with Gumbel KT)
 *   - Chapter 14: Rational Method Peak Flow (Eq. 14.1: Q = CIA / 360)
 * - JPS Hydrological Procedure No. 1 (HP1) & Climate Change Guidelines
 *
 * Valid duration range: 5 ≤ t ≤ 1000 minutes (with MSMA Table 13.3 for t < 30 min)
 * Valid ARI range: 2–100 years
 */

const IDFCalculator = (() => {
  /** Valid ARI values */
  const VALID_ARIS = [2, 5, 10, 20, 50, 100];

  /** Duration limits (minutes) */
  const MIN_DURATION = 5;
  const MIN_IDF_DURATION = 30;
  const MAX_DURATION = 1000;

  /**
   * MSMA 2nd Edition Table 13.3:
   * Values of F_D for short duration rainfall depth (d < 30 min)
   * Equation 13.3: P_d = P_30 - F_D * (P_60 - P_30)
   */
  const TABLE_13_3 = {
    durations: [5, 10, 15, 20, 30],
    p24Depths: [100, 120, 150, 180],
    factors: {
      100: [2.08, 1.28, 0.80, 0.47, 0.00],
      120: [1.85, 1.13, 0.72, 0.42, 0.00],
      150: [1.62, 0.99, 0.62, 0.36, 0.00],
      180: [1.40, 0.86, 0.54, 0.32, 0.00],
    },
  };

  /**
   * Gumbel frequency factor K_T (MSMA Appendix 13.A)
   * K_T = -ln(-ln(1 - 1/T))
   * @param {number} T - ARI in years
   * @returns {number} Gumbel frequency factor
   */
  const gumbelK = (T) => {
    if (T <= 1) return 0;
    return -Math.log(-Math.log(1 - 1 / T));
  };

  /**
   * Interpolate Table 13.3 factor F_D for duration d (5-30 min) and 2P24h depth
   * @param {number} duration - Duration in minutes (5 to 30)
   * @param {number} p24Depth - 2-year 24-hour rainfall depth (mm), default 120
   * @returns {number} F_D factor
   */
  const getFd = (duration, p24Depth = 120) => {
    if (duration >= 30) return 0.0;
    const d = Math.max(5, Math.min(30, duration));
    const p = Math.max(100, Math.min(180, p24Depth));

    const depths = TABLE_13_3.p24Depths;
    let pLow = depths[0];
    let pHigh = depths[depths.length - 1];

    for (let i = 0; i < depths.length - 1; i++) {
      if (p >= depths[i] && p <= depths[i + 1]) {
        pLow = depths[i];
        pHigh = depths[i + 1];
        break;
      }
    }

    const wp = pHigh === pLow ? 0 : (p - pLow) / (pHigh - pLow);

    const getFactorAtD = (depthKey) => {
      const arr = TABLE_13_3.factors[depthKey];
      const durs = TABLE_13_3.durations;
      for (let i = 0; i < durs.length - 1; i++) {
        if (d >= durs[i] && d <= durs[i + 1]) {
          const dLow = durs[i];
          const dHigh = durs[i + 1];
          const wd = (d - dLow) / (dHigh - dLow);
          return arr[i] + wd * (arr[i + 1] - arr[i]);
        }
      }
      return arr[arr.length - 1];
    };

    const fLow = getFactorAtD(pLow);
    const fHigh = getFactorAtD(pHigh);
    return fLow + wp * (fHigh - fLow);
  };

  /**
   * Short duration intensity calculation per MSMA 2nd Edition Eq. 13.3 & 13.4
   * P_d = P_30 - F_D * (P_60 - P_30)
   * I_d = P_d / (d / 60)
   *
   * @param {number} i30 - 30-min rainfall intensity (mm/hr)
   * @param {number} i60 - 60-min rainfall intensity (mm/hr)
   * @param {number} duration - Storm duration in minutes (5 to <30)
   * @param {number} p24Depth - 2-year 24-hr rainfall depth (mm)
   * @param {number} fallbackIntensity - Optional fallback (e.g. from power-law formula)
   * @returns {number} Rainfall intensity (mm/hr)
   */
  const calculateShortDuration = (i30, i60, duration, p24Depth = 120, fallbackIntensity = null) => {
    if (duration >= 30) return i30;
    if (duration < 5) duration = 5;

    const P30 = i30 * (30 / 60); // depth in mm
    const P60 = i60 * (60 / 60); // depth in mm
    const Fd = getFd(duration, p24Depth);
    const Pd = P30 - Fd * (P60 - P30);

    // If Pd is strictly positive and results in higher intensity than i30, return Eq 13.3 result
    if (Pd > 0) {
      const intensity = Pd / (duration / 60);
      if (intensity >= i30) {
        return intensity;
      }
    }

    // If Eq 13.3 produces negative or non-physical results (e.g. on certain high-kappa stations),
    // use the power-law base intensity if provided, or smooth square-root reduction
    if (typeof fallbackIntensity === "number" && fallbackIntensity > 0) {
      return fallbackIntensity;
    }

    const PdFallback = P30 * Math.pow(duration / 30, 0.55);
    return PdFallback / (duration / 60);
  };

  /**
   * Standard MSMA: Polynomial base equation for 30 ≤ t ≤ 1000 min
   * ln(RI_t) = a + b·ln(t) + c·[ln(t)]² + d·[ln(t)]³
   */
  const calculateStandardBase = (coeffs, duration) => {
    const lnT = Math.log(duration);
    const lnRI =
      coeffs.a +
      coeffs.b * lnT +
      coeffs.c * lnT ** 2 +
      coeffs.d * lnT ** 3;
    return Math.exp(lnRI);
  };

  /**
   * Standard MSMA: Calculate rainfall intensity for 5 ≤ t ≤ 1000 min
   * Uses Eq 13.3 for t < 30 min.
   *
   * @param {Object} coeffs - Coefficients { a, b, c, d }
   * @param {number} duration - Rainfall duration in minutes (5–1000)
   * @param {number} p24Depth - 2-year 24-hr rainfall depth (mm), default 120
   * @returns {number} Rainfall intensity in mm/hr
   */
  const calculateStandard = (coeffs, duration, p24Depth = 120) => {
    if (!coeffs || typeof duration !== "number") return null;
    if (duration < MIN_DURATION || duration > MAX_DURATION) return null;

    if (duration < MIN_IDF_DURATION) {
      const i30 = calculateStandardBase(coeffs, 30);
      const i60 = calculateStandardBase(coeffs, 60);
      if (i30 === null || i60 === null) return null;
      const iBase = calculateStandardBase(coeffs, duration);
      return calculateShortDuration(i30, i60, duration, p24Depth, iBase);
    }

    return calculateStandardBase(coeffs, duration);
  };

  /**
   * High ARI / Low ARI base equation for 30 ≤ t ≤ 1000 min
   * I_T(t) = λ × t^(-κ) × [1 + θ × K_T]^η
   */
  const calculateHighARIBase = (coeffs, duration, ari) => {
    const { lambda, kappa, theta, eta } = coeffs;
    const K_T = gumbelK(ari);
    const baseIntensity = lambda * Math.pow(duration, -kappa);
    const freqFactor = Math.pow(Math.max(0.001, 1 + theta * K_T), eta);
    return baseIntensity * freqFactor;
  };

  /**
   * High ARI / Low ARI: Calculate rainfall intensity for 5 ≤ t ≤ 1000 min
   * Uses Eq 13.3 & Table 13.3 for t < 30 min.
   *
   * @param {Object} coeffs - Coefficients { lambda, kappa, theta, eta }
   * @param {number} duration - Rainfall duration in minutes (5–1000)
   * @param {number} ari - Average Recurrence Interval in years
   * @param {number} p24Depth - 2-year 24-hr rainfall depth (mm), default 120
   * @returns {number} Rainfall intensity in mm/hr
   */
  const calculateHighARI = (coeffs, duration, ari, p24Depth = 120) => {
    if (!coeffs || typeof duration !== "number" || typeof ari !== "number") return null;
    if (duration < MIN_DURATION || duration > MAX_DURATION) return null;

    if (duration < MIN_IDF_DURATION) {
      const i30 = calculateHighARIBase(coeffs, 30, ari);
      const i60 = calculateHighARIBase(coeffs, 60, ari);
      if (isNaN(i30) || isNaN(i60)) return null;
      const iBase = calculateHighARIBase(coeffs, duration, ari);
      return calculateShortDuration(i30, i60, duration, p24Depth, iBase);
    }

    return calculateHighARIBase(coeffs, duration, ari);
  };

  /**
   * Calculate IDF intensity (dispatches to correct method based on mode)
   *
   * @param {Object} coeffs - Coefficients object or station object
   * @param {number} duration - Duration in minutes (5–1000)
   * @param {string} mode - 'highari', 'lowari', or 'standard'
   * @param {number} ari - ARI in years (2, 5, 10, 20, 50, 100)
   * @param {number} p24Depth - 2P24h depth in mm (default 120)
   * @returns {number} Rainfall intensity in mm/hr
   */
  const calculate = (coeffs, duration, mode = "highari", ari = 10, p24Depth = 120) => {
    if (mode === "highari" || mode === "lowari") {
      return calculateHighARI(coeffs, duration, ari, p24Depth);
    }
    // standard polynomial
    const ariCoeffs = coeffs?.idf ? coeffs.idf[ari] : coeffs;
    return calculateStandard(ariCoeffs, duration, p24Depth);
  };

  /**
   * MSMA Chapter 14: Rational Method Peak Flow
   * Q = (C × I × A) / 360
   *
   * @param {number} C - Runoff coefficient (dimensionless, 0–1)
   * @param {number} I - Rainfall intensity (mm/hr)
   * @param {number} A - Catchment area in hectares (ha)
   * @returns {Object} { Q_m3s, Q_Ls, isOver80ha }
   */
  const calculateRational = (C, I, A) => {
    if (typeof C !== "number" || typeof I !== "number" || typeof A !== "number") return null;
    if (C < 0 || I < 0 || A <= 0) return null;

    const Q_m3s = (C * I * A) / 360;
    const Q_Ls = Q_m3s * 1000;

    return {
      Q_m3s: parseFloat(Q_m3s.toFixed(3)),
      Q_Ls: parseFloat(Q_Ls.toFixed(1)),
      isOver80ha: A > 80,
    };
  };

  /**
   * Apply Climate Change Factor (CCF) per DID guidelines
   * I_climate = I * (1 + CCF / 100)
   *
   * @param {number} I - Base rainfall intensity (mm/hr)
   * @param {number} ccfPercent - Climate change factor in % (0–30)
   * @returns {number} Climate-adjusted rainfall intensity in mm/hr
   */
  const applyCCF = (I, ccfPercent = 0) => {
    if (typeof I !== "number" || isNaN(I)) return null;
    const factor = 1 + (Math.max(0, ccfPercent) / 100);
    return I * factor;
  };

  /**
   * Standard logarithmic sampling points for IDF Curves (5 to 1000 min)
   */
  const CHART_DURATIONS = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 360, 480, 600, 720, 1000];

  const COLOR_PALETTE = {
    2:   { line: "#3498db", bg: "rgba(52,152,219,0.08)" },
    5:   { line: "#2ecc71", bg: "rgba(46,204,113,0.08)" },
    10:  { line: "#e74c3c", bg: "rgba(231,76,60,0.08)" },
    20:  { line: "#f39c12", bg: "rgba(243,156,18,0.08)" },
    50:  { line: "#9b59b6", bg: "rgba(155,89,182,0.08)" },
    100: { line: "#1abc9c", bg: "rgba(26,188,156,0.08)" },
  };

  /**
   * Generate chart data for Standard mode (all ARIs)
   * @param {Object} station - Station with polynomial idf data
   * @param {number} p24Depth - 2P24h depth in mm (default 120)
   * @returns {Object} Chart.js dataset format
   */
  const generateChartData = (station, p24Depth = 120) => {
    if (!station?.idf) return null;

    const datasets = VALID_ARIS.map((ari) => {
      const coeffs = station.idf[ari];
      if (!coeffs) return null;

      const data = CHART_DURATIONS.map((d) => {
        const val = calculateStandard(coeffs, d, p24Depth);
        return val !== null ? parseFloat(val.toFixed(2)) : null;
      });

      return {
        label: `${ari}-year ARI`,
        data,
        borderColor: COLOR_PALETTE[ari]?.line || "#999",
        backgroundColor: COLOR_PALETTE[ari]?.bg || "rgba(0,0,0,0.05)",
        borderWidth: ari === 10 ? 3 : 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.25,
        fill: false,
      };
    }).filter(Boolean);

    return {
      labels: CHART_DURATIONS.map((d) => d.toString()),
      datasets,
    };
  };

  /**
   * Generate chart data for High ARI / Low ARI mode (all ARIs using Lambda/Kappa/Theta/Eta)
   * @param {Object} station - Station with lambda/kappa/theta/eta data
   * @param {number} p24Depth - 2P24h depth in mm (default 120)
   * @returns {Object} Chart.js dataset format
   */
  const generateHighARIChartData = (station, p24Depth = 120) => {
    if (!station || station.lambda == null) return null;

    const datasets = VALID_ARIS.map((ari) => {
      const data = CHART_DURATIONS.map((d) => {
        const val = calculateHighARI(station, d, ari, p24Depth);
        return val !== null ? parseFloat(val.toFixed(2)) : null;
      });

      return {
        label: `${ari}-year ARI`,
        data,
        borderColor: COLOR_PALETTE[ari]?.line || "#999",
        backgroundColor: COLOR_PALETTE[ari]?.bg || "rgba(0,0,0,0.05)",
        borderWidth: ari === 10 ? 3 : 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.25,
        fill: false,
      };
    });

    return {
      labels: CHART_DURATIONS.map((d) => d.toString()),
      datasets,
    };
  };

  /**
   * Generate IDF curve data points for a specific ARI
   */
  const generateCurve = (station, ari, mode = "highari", p24Depth = 120) => {
    return CHART_DURATIONS.map((d) => {
      let intensity;
      if (mode === "standard") {
        const coeffs = station?.idf?.[ari];
        intensity = coeffs ? calculateStandard(coeffs, d, p24Depth) : null;
      } else {
        intensity = calculateHighARI(station, d, ari, p24Depth);
      }
      return {
        duration: d,
        intensity: intensity !== null ? parseFloat(intensity.toFixed(2)) : null,
      };
    });
  };

  return {
    calculate,
    calculateStandard,
    calculateStandardBase,
    calculateHighARI,
    calculateHighARIBase,
    calculateShortDuration,
    calculateRational,
    applyCCF,
    getFd,
    gumbelK,
    generateCurve,
    generateChartData,
    generateHighARIChartData,
    VALID_ARIS,
    MIN_DURATION,
    MIN_IDF_DURATION,
    MAX_DURATION,
    TABLE_13_3,
    CHART_DURATIONS,
  };
})();
