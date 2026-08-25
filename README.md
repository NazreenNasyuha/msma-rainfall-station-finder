# 🌧️ MSMA Rainfall Station Finder

Find the nearest Malaysian rainfall stations, view IDF curves, and calculate rainfall intensity for stormwater design.

**🔗 [Live Demo](https://nazreennasyuha.github.io/msma-rainfall-station-finder/)**

## How to Use

1. Enter your project site coordinates (latitude & longitude)
2. Click **🔍 Find Nearest** or select a quick location
3. View the 3 nearest stations on the map and table
4. Check IDF coefficients and curves for the nearest station
5. Use the calculator to get rainfall intensity for any duration & ARI

## Features

- **Station Finder** — Haversine distance calculation to 200+ stations
- **Interactive Map** — Leaflet.js with markers, distance lines, and region filters
- **IDF Curves** — Chart.js log-log visualization for all ARI values
- **IDF Calculator** — Rainfall intensity (mm/hr) for 30–1000 min duration
- **Two IDF Modes** — Standard polynomial & Low ARI (λ, κ, θ, η)
- **East Malaysia** — Includes Sabah & Sarawak stations (SUStoM data)

## IDF Modes

| Mode | Coefficients | Equation | Coverage |
|------|-------------|----------|----------|
| **Standard** | a, b, c, d | ln(RI_t) = a + b·ln(t) + c·[ln(t)]² + d·[ln(t)]³ | 35 urban centres |
| **Low ARI** | λ, κ, θ, η | I_T(t) = λ × t^(-κ) × [1 + θ × K_T]^η | 150+ extended stations |

## Data Sources

| Source | Coverage | Year |
|--------|----------|------|
| MSMA 2nd Edition | Peninsular Malaysia (40+ stations) | 2012 |
| SUStoM / HP26 | Sabah (14) & Sarawak (12) | 2018 |
| Appendix 13.A | Extended station network (150+ stations) | 2012 |

## Disclaimer

This tool is for **preliminary reference only**. Station coordinates are approximate. Always verify data with official publications for actual design purposes.

## License

Copyright © 2024. Data sourced from publicly available Malaysian Department of Irrigation and Drainage (DID) publications. This tool is provided "as is" without warranty of any kind.

---

*Built for Malaysian Hydrological Engineering*
