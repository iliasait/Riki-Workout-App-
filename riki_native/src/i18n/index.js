/**
 * i18n/index.js
 * Auteur : Ilias Ait Benaissa
 * Description : Configuration de l'internationalisation (i18next + react-i18next).
 *               Charge les dictionnaires francais et anglais. La langue par defaut est
 *               le francais ; elle peut etre changee depuis les reglages et persistee.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./fr.json";
import en from "./en.json";

i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en } },
  lng: "fr",
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
  compatibilityJSON: "v3",
});

export default i18n;
