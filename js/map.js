/**
 * Map Module
 * Handles Leaflet.js map initialization, markers, lines, clicks, and interactions.
 */

const MapModule = (() => {
  let map = null;
  let stationMarkers = [];
  let stationMarkersMap = {};
  let userMarker = null;
  let connectionLines = [];
  let onMapClickCallback = null;

  /** Region color mapping */
  const REGION_COLORS = {
    peninsular: "#2980b9",
    sabah: "#e74c3c",
    sarawak: "#f39c12",
  };

  /** Line colors for nearest stations */
  const LINE_COLORS = ["#27ae60", "#f39c12", "#e67e22"];

  /**
   * Initialize the map
   * @param {string} containerId - DOM element ID for the map
   */
  const init = (containerId = "map") => {
    map = L.map(containerId, {
      center: [3.5, 109],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Map click handler to pick project site coordinates
    map.on("click", (e) => {
      if (typeof onMapClickCallback === "function") {
        onMapClickCallback(e.latlng.lat, e.latlng.lng);
      }
    });

    return map;
  };

  /**
   * Set callback for map click
   * @param {Function} callback - fn(lat, lon)
   */
  const setOnMapClick = (callback) => {
    onMapClickCallback = callback;
  };

  /**
   * Render station markers on the map
   * @param {Array} stations - Array of station objects
   */
  const renderStations = (stations) => {
    clearStations();
    stationMarkersMap = {};

    stations.forEach((s) => {
      const color = REGION_COLORS[s.region] || "#2980b9";
      const marker = L.circleMarker([s.lat, s.lon], {
        radius: 5,
        color: "#fff",
        weight: 2,
        fillColor: color,
        fillOpacity: 0.9,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Segoe UI,sans-serif;min-width:180px">
            <b style="color:#1a5276">${s.id}: ${s.name}</b><br>
            <span style="color:#666">${s.state} · ${s.region}</span><br>
            <small style="color:#888">Lat: ${s.lat.toFixed(4)}, Lon: ${s.lon.toFixed(4)}</small>
            <div style="margin-top:8px">
              <button onclick="App.selectStationById('${s.id}')" style="
                background:#2980b9;color:#fff;border:none;padding:5px 10px;
                border-radius:5px;cursor:pointer;font-size:0.8rem;font-weight:600;width:100%;
                display:block;text-align:center;transition:background 0.2s;
              ">📊 Select This Station</button>
            </div>
          </div>`
        );

      stationMarkers.push(marker);
      stationMarkersMap[s.id] = marker;
    });
  };

  /**
   * Clear all station markers
   */
  const clearStations = () => {
    stationMarkers.forEach((m) => map.removeLayer(m));
    stationMarkers = [];
    stationMarkersMap = {};
  };

  /**
   * Place user site marker
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   */
  const setUserMarker = (lat, lon) => {
    if (userMarker) map.removeLayer(userMarker);

    const icon = L.divIcon({
      className: "",
      html: `<div style="
        background:#e74c3c;width:20px;height:20px;border-radius:50%;
        border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.5);
        position:relative;z-index:1000;animation:pulseSite 2s infinite;
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    userMarker = L.marker([lat, lon], { icon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:Segoe UI,sans-serif">
          <b style="color:#e74c3c">📍 Project Site</b><br>
          <small>Lat: ${lat.toFixed(4)}°N, Lon: ${lon.toFixed(4)}°E</small>
        </div>`
      );

    return userMarker;
  };

  /**
   * Draw lines from user site to nearest stations
   * @param {number} userLat - User latitude
   * @param {number} userLon - User longitude
   * @param {Array} nearestStations - Array of nearest stations
   */
  const drawLines = (userLat, userLon, nearestStations) => {
    clearLines();

    nearestStations.forEach((s, i) => {
      const line = L.polyline(
        [
          [userLat, userLon],
          [s.lat, s.lon],
        ],
        {
          color: LINE_COLORS[i] || "#999",
          weight: i === 0 ? 3.5 : 2,
          dashArray: i === 0 ? "" : "8 6",
          opacity: 0.85,
        }
      )
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Segoe UI,sans-serif">
            <b>${i === 0 ? "🥇 Nearest Station:" : i === 1 ? "🥈 2nd Nearest:" : "🥉 3rd Nearest:"} ${s.name}</b><br>
            Distance: <b>${s.dist.toFixed(2)} km</b>
          </div>`
        );

      connectionLines.push(line);
    });
  };

  /**
   * Highlight a specific station marker on the map
   * @param {string} stationId - ID of station to highlight
   */
  const highlightStation = (stationId) => {
    const marker = stationMarkersMap[stationId];
    if (marker) {
      marker.openPopup();
    }
  };

  /**
   * Clear connection lines
   */
  const clearLines = () => {
    connectionLines.forEach((l) => map.removeLayer(l));
    connectionLines = [];
  };

  /**
   * Clear user marker
   */
  const clearUserMarker = () => {
    if (userMarker) {
      map.removeLayer(userMarker);
      userMarker = null;
    }
  };

  /**
   * Clear everything (markers + lines)
   */
  const clearAll = () => {
    clearStations();
    clearUserMarker();
    clearLines();
  };

  /**
   * Filter and show stations by region
   * @param {string} region - 'all', 'peninsular', 'sabah', or 'sarawak'
   * @param {Array} allStations - Full station list
   */
  const filterByRegion = (region, allStations) => {
    const filtered =
      region === "all"
        ? allStations
        : allStations.filter((s) => s.region === region);

    renderStations(filtered);

    if (filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map((s) => [s.lat, s.lon]));
      map.fitBounds(bounds.pad(0.1));
    }
  };

  /**
   * Fit map to show user and nearest stations
   * @param {number} userLat
   * @param {number} userLon
   * @param {Array} stations
   */
  const fitToResults = (userLat, userLon, stations) => {
    const pts = [
      [userLat, userLon],
      ...stations.map((s) => [s.lat, s.lon]),
    ];
    map.fitBounds(L.latLngBounds(pts).pad(0.15));
  };

  return {
    init,
    setOnMapClick,
    renderStations,
    clearStations,
    setUserMarker,
    clearUserMarker,
    drawLines,
    clearLines,
    clearAll,
    filterByRegion,
    fitToResults,
    highlightStation,
    REGION_COLORS,
    LINE_COLORS,
  };
})();
