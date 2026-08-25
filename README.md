# 🌧️ MSMA Rainfall Station Finder

A web-based tool for Malaysian hydrological engineers to find the nearest MSMA 2nd Edition & SUStoM rainfall stations, calculate distances using the Haversine formula, and compute IDF rainfall intensities.

## 🚀 Live Demo

[Open in Browser](https://github.com/nazre/msma-rainfall-station-finder/blob/main/index.html) — Just open `index.html` in any browser. No server required.

## ✨ Features

### 📍 Station Finder
- Enter your project site coordinates (latitude/longitude)
- Instantly find the **3 nearest rainfall stations** using the Haversine formula
- Quick-select buttons for major Malaysian cities (Peninsular + East Malaysia)

### 🗺️ Interactive Map
- **Leaflet.js** map with 65+ rainfall stations across Malaysia
- Color-coded markers by region:
  - 🔵 Blue — Peninsular Malaysia (MSMA 2nd Edition)
  - 🔴 Red — Sabah (SUStoM / HP26)
  - 🟠 Orange — Sarawak (SUStoM / HP26)
- **Lines** drawn from your site to the 3 nearest stations
- Click markers for station details
- Filter by region: All | Peninsular | Sabah | Sarawak

### 📈 IDF Coefficients
- Full polynomial coefficients (a, b, c, d) for 6 ARI values (2, 5, 10, 20, 50, 100 years)
- Based on **MSMA 2nd Edition Appendix 13.A** and **SUStoM (2018)**

### 🧮 IDF Rainfall Intensity Calculator
- Compute rainfall intensity (mm/hr) for any duration (30–1000 min) and ARI
- Uses the MSMA polynomial equation:
  ```
  ln(RI_t) = a + b·ln(t) + c·[ln(t)]² + d·[ln(t)]³
  ```

## 📊 Database Coverage

| Region | Stations | Source |
|--------|----------|--------|
| Peninsular Malaysia | 40+ | MSMA 2nd Edition (2012) |
| Sabah | 14 | SUStoM / HP26 (2018) |
| Sarawak | 12 | SUStoM / HP26 (2018) |

## 📖 References

- **MSMA 2nd Edition (2012)** — Urban Stormwater Management Manual for Malaysia, Department of Irrigation and Drainage (DID) Malaysia
- **SUStoM (2018)** — Estimation of Design Rainstorm in Sabah and Sarawak, Revised and Updated 2018
- **HP26 (1984/2018)** — Hydrological Procedure No. 26: Estimation of Design Rainstorm in Sabah and Sarawak

## ⚠️ Disclaimer

This tool is for **preliminary reference only**. Station coordinates are approximate. Always verify data with official DID publications for actual design purposes.

## 🛠️ How to Use

1. Open `index.html` in any modern web browser
2. Enter your project site coordinates or click a quick location
3. Click **🔍 Find Nearest**
4. View the 3 nearest stations, map with lines, and IDF coefficients
5. Use the IDF calculator to compute rainfall intensity

## 📁 Project Structure

```
msma-rainfall-station-finder/
├── index.html      # Complete web application (single file)
├── README.md       # This file
└── .gitignore      # Git ignore rules
```

## 📜 License

This project uses publicly available data from Malaysian DID publications. For educational and reference purposes.

---

**Built with ❤️ for Malaysian Hydrological Engineering**
