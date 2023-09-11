import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    preload    : ['en'],
    load       : 'languageOnly',
    fallbackLng: 'en',
    debug        : process.env.REACT_APP_ENVIRONMENT === "development",
    backend      : {
      loadPath: process.env.REACT_APP_PATH + '/locales/{{lng}}/{{ns}}.json'
    },
    react        : {
      useSuspense               : true,
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'b', 'kbd']
    },
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
  })
  .then((_r) => {
  })

export default i18n