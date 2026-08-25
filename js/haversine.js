/**
 * Haversine Distance Calculator
 * Calculates great-circle distance between two points on Earth
 * using the Haversine formula.
 */

const Haversine = (() => {
  /** Earth's mean radius in kilometers */
  const EARTH_RADIUS_KM = 6371;

  /**
   * Convert degrees to radians
   * @param {number} deg - Angle in degrees
   * @returns {number} Angle in radians
   */
  const toRad = (deg) => (deg * Math.PI) / 180;

  /**
   * Convert radians to degrees
   * @param {number} rad - Angle in radians
   * @returns {number} Angle in degrees
   */
  const toDeg = (rad) => (rad * 180) / Math.PI;

  /**
   * Calculate distance between two geographic coordinates
   * @param {number} lat1 - Latitude of point 1 (degrees)
   * @param {number} lon1 - Longitude of point 1 (degrees)
   * @param {number} lat2 - Latitude of point 2 (degrees)
   * @param {number} lon2 - Longitude of point 2 (degrees)
   * @returns {number} Distance in kilometers
   */
  const distance = (lat1, lon1, lat2, lon2) => {
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
  };

  /**
   * Calculate bearing from point 1 to point 2
   * @param {number} lat1 - Latitude of point 1 (degrees)
   * @param {number} lon1 - Longitude of point 1 (degrees)
   * @param {number} lat2 - Latitude of point 2 (degrees)
   * @param {number} lon2 - Longitude of point 2 (degrees)
   * @returns {string} Bearing as cardinal direction and degrees
   */
  const bearing = (lat1, lon1, lat2, lon2) => {
    const dLon = toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
    let brng = (toDeg(Math.atan2(y, x)) + 360) % 360;

    const directions = [
      "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
    ];
    const index = Math.round(brng / 22.5) % 16;
    return `${directions[index]} (${brng.toFixed(1)}°)`;
  };

  /**
   * Find N nearest stations to a given coordinate
   * @param {number} lat - Target latitude
   * @param {number} lon - Target longitude
   * @param {Array} stationList - Array of station objects
   * @param {number} n - Number of nearest stations to return
   * @returns {Array} Sorted array of stations with distance property
   */
  const findNearest = (lat, lon, stationList, n = 3) => {
    return stationList
      .map((s) => ({ ...s, dist: distance(lat, lon, s.lat, s.lon) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, n);
  };

  return { distance, bearing, findNearest, toRad, toDeg, EARTH_RADIUS_KM };
})();
