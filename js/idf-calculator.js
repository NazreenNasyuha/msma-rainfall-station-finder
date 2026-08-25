/**
 * IDF (Intensity-Duration-Frequency) Calculator
 *
 * Supports two modes:
 * 1. Standard MSMA — ln(RI_t) = a + b·ln(t) + c·[ln(t)]² + d·[ln(t)]³
 * 2. High ARI — I_T(t) = λ × t^(-κ) × [1 + θ × K_T]^η
 *
 * Valid for: 30 ≤ t ≤ 1000 minutes, ARI 2–100 years
 */

const IDFCalculator = (() => {
  /** Valid ARI values */
  const VALID_ARIS = [2, 5, 10, 20, 50, 100];

  /** Duration limits (minutes) */
  const MIN_DURATION = 30;
  const MAX_DURATION = 1000;

  /**
   * Gumbel frequency factor K_T
   * K_T = -ln(-ln(1 - 1/T))
   * @param {number} T - ARI in years
   * @returns {number} Gumbel frequency factor
   */
  const gumbelK = (T) => -Math.log(-Math.log(1 - 1 / T));

  /**
   * Standard MSMA: Calculate rainfall intensity using polynomial coefficients
   * ln(RI_t) = a + b·ln(t) + c·[ln(t)]² + d·[ln(t)]³
   *
   * @param {Object} coeffs - Coefficients { a, b, c, d }
   * @param {number} duration - Rainfall duration in minutes (30–1000)
   * @returns {number} Rainfall intensity in mm/hr
   */
  const calculateStandard = (coeffs, duration) => {
    if (!coeffs || typeof duration !== "number") return null;
    if (duration < MIN_DURATION || duration > MAX_DURATION) return null;

    const lnT = Math.log(duration);
    const lnRI =
      coeffs.a +
      coeffs.b * lnT +
      coeffs.c * lnT ** 2 +
      coeffs.d * lnT ** 3;

    return Math.exp(lnRI);
  };

  /**
   * High ARI: Calculate rainfall intensity using Lambda/Kappa/Theta/Eta
   * I_T(t) = λ × t^(-κ) × [1 + θ × K_T]^η
   *
   * @param {Object} coeffs - Coefficients { lambda, kappa, theta, eta }
   * @param {number} duration - Rainfall duration in minutes (30–1000)
   * @param {number} ari - Average Recurrence Interval in years
   * @returns {number} Rainfall intensity in mm/hr
   */
  const calculateHighARI = (coeffs, duration, ari) => {
    if (!coeffs || typeof duration !== "number" || typeof ari !== "number") return null;
    if (duration < MIN_DURATION || duration > MAX_DURATION) return null;

    const { lambda, kappa, theta, eta } = coeffs;
    const K_T = gumbelK(ari);
    const baseIntensity = lambda * Math.pow(duration, -kappa);
    const freqFactor = Math.pow(1 + theta * K_T, eta);

    return baseIntensity * freqFactor;
  };

  /**
   * Calculate IDF intensity (dispatches to correct method)
   * @param {Object} coeffs - Coefficients object
   * @param {number} duration - Duration in minutes
   * @param {string} mode - 'standard' or 'highari'
   * @param {number} ari - ARI in years (required for highari)
   * @returns {number} Rainfall intensity in mm/hr
   */
  const calculate = (coeffs, duration, mode = "standard", ari = 10) => {
    if (mode === "highari") {
      return calculateHighARI(coeffs, duration, ari);
    }
    return calculateStandard(coeffs, duration);
  };

  /**
   * Generate IDF curve data points for a standard station
   * @param {Object} station - Station object with idf property
   * @param {number} ari - ARI in years
   * @param {number} numPoints - Number of data points
   * @returns {Array} Array of { duration, intensity } objects
   */
  const generateCurve = (station, ari, numPoints = 50) => {
    const coeffs = station?.idf?.[ari];
    if (!coeffs) return [];

    const step = (MAX_DURATION - MIN_DURATION) / (numPoints - 1);
    const points = [];

    for (let i = 0; i < numPoints; i++) {
      const duration = Math.round(MIN_DURATION + step * i);
      const intensity = calculateStandard(coeffs, duration);
      if (intensity !== null) {
        points.push({ duration, intensity: parseFloat(intensity.toFixed(2)) });
      }
    }

    return points;
  };

  /**
   * Generate chart data for Standard mode (all ARIs)
   * @param {Object} station - Station with polynomial idf data
   * @returns {Object} Chart.js dataset format
   */
  const generateChartData = (station) => {
    if (!station?.idf) return null;

    const durations = [];
    const step = (MAX_DURATION - MIN_DURATION) / 49;
    for (let i = 0; i < 50; i++) {
      durations.push(Math.round(MIN_DURATION + step * i));
    }

    const colors = {
      2:   { line: "#3498db", bg: "rgba(52,152,219,0.1)" },
      5:   { line: "#2ecc71", bg: "rgba(46,204,113,0.1)" },
      10:  { line: "#e74c3c", bg: "rgba(231,76,60,0.1)" },
      20:  { line: "#f39c12", bg: "rgba(243,156,18,0.1)" },
      50:  { line: "#9b59b6", bg: "rgba(155,89,182,0.1)" },
      100: { line: "#1abc9c", bg: "rgba(26,188,156,0.1)" },
    };

    const datasets = VALID_ARIS.map((ari) => {
      const coeffs = station.idf[ari];
      if (!coeffs) return null;

      const data = durations.map((d) => {
        const val = calculateStandard(coeffs, d);
        return val !== null ? parseFloat(val.toFixed(2)) : null;
      });

      return {
        label: `${ari}-year ARI`,
        data,
        borderColor: colors[ari]?.line || "#999",
        backgroundColor: colors[ari]?.bg || "rgba(0,0,0,0.05)",
        borderWidth: ari === 10 ? 3 : 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.4,
        fill: false,
      };
    }).filter(Boolean);

    return {
      labels: durations.map((d) => d.toString()),
      datasets,
    };
  };

  /**
   * Generate chart data for High ARI mode (all ARIs using Lambda/Kappa/Theta/Eta)
   * @param {Object} station - Station with lambda/kappa/theta/eta data
   * @returns {Object} Chart.js dataset format
   */
  const generateHighARIChartData = (station) => {
    if (!station || station.lambda == null) return null;

    const durations = [];
    const step = (MAX_DURATION - MIN_DURATION) / 49;
    for (let i = 0; i < 50; i++) {
      durations.push(Math.round(MIN_DURATION + step * i));
    }

    const colors = {
      2:   { line: "#3498db", bg: "rgba(52,152,219,0.1)" },
      5:   { line: "#2ecc71", bg: "rgba(46,204,113,0.1)" },
      10:  { line: "#e74c3c", bg: "rgba(231,76,60,0.1)" },
      20:  { line: "#f39c12", bg: "rgba(243,156,18,0.1)" },
      50:  { line: "#9b59b6", bg: "rgba(155,89,182,0.1)" },
      100: { line: "#1abc9c", bg: "rgba(26,188,156,0.1)" },
    };

    const datasets = VALID_ARIS.map((ari) => {
      const data = durations.map((d) => {
        const val = calculateHighARI(station, d, ari);
        return val !== null ? parseFloat(val.toFixed(2)) : null;
      });

      return {
        label: `${ari}-year ARI`,
        data,
        borderColor: colors[ari]?.line || "#999",
        backgroundColor: colors[ari]?.bg || "rgba(0,0,0,0.05)",
        borderWidth: ari === 10 ? 3 : 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.4,
        fill: false,
      };
    });

    return {
      labels: durations.map((d) => d.toString()),
      datasets,
    };
  };

  return {
    calculate,
    calculateStandard,
    calculateHighARI,
    gumbelK,
    generateCurve,
    generateChartData,
    generateHighARIChartData,
    VALID_ARIS,
    MIN_DURATION,
    MAX_DURATION,
  };
})();
