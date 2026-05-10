import { City } from "../types";

export const FLIGHT_CITIES: City[] = [
  { code: 'DEL', name: 'New Delhi' },
  { code: 'BOM', name: 'Mumbai' },
  { code: 'BLR', name: 'Bengaluru' },
  { code: 'HYD', name: 'Hyderabad' },
  { code: 'MAA', name: 'Chennai' },
  { code: 'CCU', name: 'Kolkata' },
  { code: 'AMD', name: 'Ahmedabad' },
  { code: 'PNQ', name: 'Pune' },
  { code: 'COK', name: 'Kochi' },
  { code: 'GOI', name: 'Goa' },
  { code: 'JAI', name: 'Jaipur' },
  { code: 'LKO', name: 'Lucknow' }
];

export const TRAIN_CITIES: City[] = [
  { code: 'NDLS', name: 'New Delhi' },
  { code: 'CSTM', name: 'Mumbai CST' },
  { code: 'SBC', name: 'Bengaluru' },
  { code: 'HYD', name: 'Hyderabad' },
  { code: 'MAS', name: 'Chennai' },
  { code: 'HWH', name: 'Kolkata' },
  { code: 'ADI', name: 'Ahmedabad' },
  { code: 'PUNE', name: 'Pune' }
];

export const BUS_ROUTES = [
  { from: "Hyderabad", to: "Vijayawada", duration: 270 },
  { from: "Hyderabad", to: "Bengaluru", duration: 540 },
  { from: "Hyderabad", to: "Chennai", duration: 480 },
  { from: "Hyderabad", to: "Pune", duration: 600 },
  { from: "Hyderabad", to: "Mumbai", duration: 720 },
  { from: "Mumbai", to: "Pune", duration: 180 },
  { from: "Mumbai", to: "Bengaluru", duration: 900 },
  { from: "Mumbai", to: "Goa", duration: 480 },
  { from: "Chennai", to: "Pondicherry", duration: 180 },
  { from: "Chennai", to: "Bengaluru", duration: 360 },
  { from: "Delhi", to: "Agra", duration: 240 },
  { from: "Delhi", to: "Jaipur", duration: 300 },
  { from: "Delhi", to: "Lucknow", duration: 420 },
  { from: "Bengaluru", to: "Mysuru", duration: 180 },
  { from: "Bengaluru", to: "Chennai", duration: 360 },
  { from: "Pune", to: "Bengaluru", duration: 720 },
  { from: "Pune", to: "Goa", duration: 420 }
];

export const DURATIONS: Record<string, number> = {
  "DEL-BOM": 125, "DEL-BLR": 155, "DEL-HYD": 130, "DEL-MAA": 165,
  "DEL-CCU": 140, "DEL-AMD": 120, "DEL-PNQ": 135, "DEL-COK": 180,
  "DEL-GOI": 150, "DEL-JAI": 70, "DEL-LKO": 90,
  "BOM-BLR": 90, "BOM-HYD": 80, "BOM-MAA": 110, "BOM-CCU": 150,
  "BOM-AMD": 100, "BOM-PNQ": 60, "BOM-COK": 140, "BOM-GOI": 75,
  "BLR-HYD": 65, "BLR-MAA": 60, "BLR-CCU": 180, "BLR-AMD": 140,
  "BLR-PNQ": 90, "BLR-COK": 60, "BLR-GOI": 120,
  "HYD-MAA": 80, "HYD-CCU": 140, "HYD-AMD": 100, "HYD-PNQ": 90,
  "HYD-COK": 120, "HYD-GOI": 180,
  "MAA-CCU": 120, "MAA-AMD": 160, "MAA-PNQ": 120, "MAA-COK": 60,
  "MAA-GOI": 90,
  "CCU-AMD": 180, "CCU-PNQ": 180, "CCU-COK": 180, "CCU-GOI": 180,
  "AMD-PNQ": 90, "AMD-COK": 120, "AMD-GOI": 120,
  "PNQ-COK": 120, "PNQ-GOI": 60,
  "COK-GOI": 90,
  "NDLS-CSTM": 960, "NDLS-SBC": 1980, "NDLS-HYD": 1440, "NDLS-MAS": 1800,
  "NDLS-HWH": 1200, "NDLS-ADI": 720, "NDLS-PUNE": 1200,
  "CSTM-SBC": 1440, "CSTM-HYD": 900, "CSTM-MAS": 1320, "CSTM-HWH": 1800,
  "CSTM-ADI": 480, "CSTM-PUNE": 180,
  "MAS-HYD": 480, "MAS-SBC": 360
};

export const QUOTES = [
  "The journey of a thousand miles begins with one step.",
  "Focus is the new IQ. Guard it.",
  "Study hard, fly high.",
  "Smooth seas do not make skillful sailors.",
  "Discipline is the bridge between goals and accomplishment."
];
