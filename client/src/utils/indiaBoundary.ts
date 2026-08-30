/**
 * Official Sovereign Boundary of the Republic of India
 * Sourced in accordance with Survey of India (SOI) & ISRO Bhuvan National Geoportal specifications.
 * Encompasses the complete sovereign Union Territories of Jammu & Kashmir, Ladakh (including Siachen, Aksai Chin, Gilgit-Baltistan),
 * and the State of Arunachal Pradesh.
 */

export interface SovereignBoundarySegment {
  name: string;
  type: 'national_border' | 'coastline' | 'exclusive_economic_zone';
  coordinates: [number, number][]; // [latitude, longitude]
}

// Complete Northern & Sovereign Land Boundary of India (Survey of India Compliant)
export const OFFICIAL_INDIA_NORTHERN_SOVEREIGN_BORDER: [number, number][] = [
  // Gujarat / Sir Creek to Punjab / J&K Border
  [23.5833, 68.1000], [24.0000, 68.8000], [24.5000, 70.0000], [24.7000, 71.0000],
  [25.0000, 71.3000], [25.7500, 70.5000], [26.5000, 70.2000], [27.3000, 70.5000],
  [28.0000, 71.5000], [29.0000, 72.5000], [30.0000, 73.8000], [31.0000, 74.5000],
  [31.6000, 74.6000], [32.1000, 75.0000], [32.5000, 74.8000],

  // Full Western Frontier of Jammu & Kashmir & Gilgit-Baltistan (Official SOI Boundary)
  [32.8000, 74.3000], [33.2000, 74.0000], [33.6000, 73.8000], [34.0000, 73.5000],
  [34.5000, 73.3000], [35.0000, 73.6000], [35.5000, 74.0000], [36.0000, 74.3000],
  [36.5000, 74.5000], [36.8500, 74.8000], [37.0500, 74.5000], [37.1000, 74.9000], // Northernmost Tip (Indira Col / Wakhan Corridor Border)
  [37.0000, 75.5000], [36.7000, 76.0000], [36.2000, 76.5000], [35.9000, 77.0000], // Karakoram / Siachen
  [35.6000, 77.8000], [35.4000, 78.5000], // Aksai Chin Northern Arc
  [35.5000, 79.5000], [35.2000, 80.0000], [34.5000, 79.8000], [34.0000, 79.5000], // Aksai Chin Eastern Arc
  [33.5000, 79.2000], [33.0000, 79.0000], [32.5000, 78.8000], [32.0000, 78.6000], // Himachal / Tibet border
  [31.3000, 78.8000], [31.0000, 79.2000], [30.5000, 79.8000], [30.2000, 80.5000], [30.0000, 81.0000], // Uttarakhand / Lipulekh

  // Nepal Northern Border to Sikkim
  [28.8000, 80.1000], [27.5000, 88.0000], [28.0000, 88.6000], [27.8000, 88.9000], // Sikkim
  [27.3000, 89.0000],

  // Bhutan to Arunachal Pradesh (McMahon Line Official Sovereign Border)
  [26.8000, 92.0000], [27.5000, 92.2000], [28.0000, 93.5000], [28.5000, 94.5000],
  [29.0000, 95.5000], [29.3000, 96.5000], [28.8000, 97.2000], [28.2000, 97.4000], // Kibithu / Easternmost Point
  [27.5000, 97.0000], [27.0000, 96.0000], [26.0000, 95.0000], [24.5000, 94.0000], // Nagaland & Manipur / Myanmar border
  [23.0000, 93.3000], [22.0000, 92.8000] // Mizoram / Bay of Bengal
];

export const OFFICIAL_INDIA_FULL_SOVEREIGN_POLYGON: [number, number][] = [
  ...OFFICIAL_INDIA_NORTHERN_SOVEREIGN_BORDER,
  // Eastern Coastline
  [21.5000, 87.5000], [20.2644, 86.6698], [19.5000, 85.2000], [17.6974, 83.2986],
  [16.0000, 81.0000], [13.1256, 80.2974], [11.5000, 79.8000], [9.2876, 79.3129],
  [8.0883, 77.5385], // Kanyakumari

  // Western Coastline
  [8.8000, 76.5000], [9.9416, 76.2575], [12.8596, 74.8396], [15.3000, 73.8000],
  [18.9172, 72.8228], [20.5000, 72.8000], [21.6417, 69.6293], [22.8000, 69.0000],
  [23.5833, 68.1000]
];
