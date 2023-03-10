import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
// import LanguageDetector from "i18next-browser-languagedetector";
// import vnTranslation from "./locales/vn.json";

// load translations
// fetch('/api/locales/vn/translation')
//     .then(response => response.json())
//     .then(data => {
//         i18n.addResourceBundle('vn', 'translation', data);
//     });

i18n
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // .use(LanguageDetector) // detect user language, learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(initReactI18next) // pass the i18n instance to react-i18next.
    // init i18next, for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: true,
        // The default is `load: all` which may give result like: `en-US` if the LanguageDetector is used
        // load: "languageOnly", // This is to load the language code 'en','vn'
        fallbackLng: "en",
        lng: "vn",
        backend: {
            loadPath: "/api/locales/{{lng}}/{{ns}}",
            allowMultiLoading: false,
        },
        // resources: {
        //     vn: {
        //         translation: vnTranslation,
        //     },
        // },
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    });

export default i18n;
