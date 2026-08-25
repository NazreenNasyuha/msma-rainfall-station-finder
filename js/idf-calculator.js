/**
 * IDF (Intensity-Duration-Frequency) Calculator
 *
 * Uses the MSMA 2nd Edition polynomial equation:
 *   ln(RI_t) = a + b·ln(t) + c·[ln(t)]² + d·[ln(t)]³
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
   * Calculate rainfall intensity using IDF polynomial coefficients
   * @param {Object} coeffs - Coefficients { a, b, c, d }
   * @param {number} duration - Rainfall duration in minutes (30–1000)
   * @returns {number} Rainfall intensity in mm/hr
   */
  const calculate = (coeffs, duration) => {
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
   * Generate IDF curve data points for a station
   * @param {Object} station - Station object with idf property
   * @param {number} ari - Average Recurrence Interval in years
   * @param {number} numPoints - Number of data points to generate
   * @returns {Array} Array of { duration, intensity } objects
   */
  const generateCurve = (station, ari, numPoints = 50) => {
    const coeffs = station?.idf?.[ari];
    if (!coeffs) return [];

    const step = (MAX_DURATION - MIN_DURATION) / (numPoints - 1);
    const points = [];

    for (let i = 0; i < numPoints; i++) {
      const duration = Math.round(MIN_DURATION + step * i);
      const intensity = calculate(coeffs, duration);
      if (intensity !== null) {
        points.push({ duration, intensity: parseFloat(intensity.toFixed(2)) });
      }
    }

    return points;
  };

  /**
   * Generate complete IDF dataset for charting (all ARIs)
   * @param {Object} station - Station object with idf property
   * @returns {Object} { labels, datasets } for Chart.js
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
        const val = calculate(coeffs, d);
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

  return {
    calculate,
    generateCurve,
    generateChartData,
    VALID_ARIS,
    MIN_DURATION,
    MAX_DURATION,
  };
})();
