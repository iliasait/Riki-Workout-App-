/**
 * colors.js
 * Auteur : Ilias Ait Benaissa
 * Description : Design system de RIKI. Definit les deux palettes (sombre et claire),
 *               les polices et les helpers de style partages. Adaptation React Native
 *               du systeme de couleurs concu pour l'application.
 */

export const DARK = {
  bg: "#060606",
  sf: "#0C0C0C",
  c1: "#141414",
  c2: "#1E1E1E",
  c3: "#2A2A2A",
  gr: "#BEFF6C",
  gd: "#8AFF00",
  t: "#F5F5F0",
  ts: "#6B6B6B",
  t2: "#999999",
  rd: "#FF4D4D",
  glass: "rgba(255,255,255,0.03)",
  glassBorder: "rgba(255,255,255,0.06)",
  navBg: "#0C0C0C",
  navBorder: "rgba(255,255,255,0.06)",
};

export const LIGHT = {
  bg: "#F8F8F6",
  sf: "#FFFFFF",
  c1: "#EFEFED",
  c2: "#E2E2DE",
  c3: "#D4D4D0",
  gr: "#4CAF00",
  gd: "#3D8C00",
  t: "#1A1A1A",
  ts: "#777777",
  t2: "#555555",
  rd: "#E53935",
  glass: "rgba(0,0,0,0.03)",
  glassBorder: "rgba(0,0,0,0.08)",
  navBg: "#FFFFFF",
  navBorder: "rgba(0,0,0,0.08)",
};

export const FONT = {
  display: "System",
  body: "System",
};

export function getPalette(theme) {
  return theme === "light" ? LIGHT : DARK;
}
