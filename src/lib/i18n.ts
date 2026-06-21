import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  English: {
    translation: {
      "nav": {
        "home": "Home",
        "recruitment": "Recruitment",
        "ethics": "Ethics",
        "privacy": "Privacy",
        "dashboard": "Command Center",
        "login": "Login",
        "logout": "Logout"
      },
      "hero": {
        "badge": "Uganda Data Protection Compliant",
        "title": "The Gateway to Reliable Field Intelligence",
        "subtitle": "StatGate provides a secure, ethical, and transparent platform for managing field agents, recruitment, and vendor ledgers.",
        "cta_agent": "Join as Agent",
        "cta_vendor": "Vendor Portal"
      },
      "dashboard": {
        "title": "StatGate Dashboard",
        "overview": "Overview",
        "sync": "Sovereign Sync",
        "agents": "Field Agents",
        "reports": "District Reports",
        "fellowship": "Fellowship",
        "sandbox": "Data Sandbox",
        "audit": "Audit Ledger"
      }
    }
  },
  Luganda: {
    translation: {
      "nav": {
        "home": "Awaka",
        "recruitment": "Okunoonya Abakozi",
        "ethics": "Empisa",
        "privacy": "Ekyama",
        "dashboard": "Markaz y'Okulambika",
        "login": "Yingira",
        "logout": "Ffuluma"
      },
      "hero": {
        "badge": "Okukuuma Data mu Uganda",
        "title": "Omulyango gw'Okufuna Amawulire Ameesigwa",
        "subtitle": "StatGate ekuwa omusingi omunywevu, ogw'empisa, era ogulimu obwerufu mu kuddukanya abakozi b'o mu kisaawe.",
        "cta_agent": "Yingira nga Omukozi",
        "cta_vendor": "Portal y'Abatunzi"
      },
      "dashboard": {
        "title": "StatGate Dashboard",
        "overview": "Okulaba Okwawamu",
        "sync": "Sovereign Sync",
        "agents": "Abakozi b'o mu Kisaawe",
        "reports": "Alipoota z'e Disitulikiti",
        "fellowship": "Obumu",
        "sandbox": "Sandbox ya Data",
        "audit": "Ebitabo by'Okubala"
      }
    }
  },
  Acholi: {
    translation: {
      "nav": {
        "home": "Gang",
        "recruitment": "Yero Latic",
        "ethics": "Kit me Kwo",
        "privacy": "Mung",
        "dashboard": "Kabedo me Loc",
        "login": "Donyo",
        "logout": "Kati"
      },
      "hero": {
        "badge": "Gwoko Data me Uganda",
        "title": "Yub me Ada pi Neno Ada",
        "subtitle": "StatGate miyo kabedo me gwoko ada me data ki bura me Africa.",
        "cta_agent": "Donyo macalo Latic",
        "cta_vendor": "Portal me Vendor"
      },
      "dashboard": {
        "title": "StatGate Dashboard",
        "overview": "Neno ducu",
        "sync": "Sovereign Sync",
        "agents": "Lutic me Bar",
        "reports": "Ripot me District",
        "fellowship": "Ribbe",
        "sandbox": "Sandbox me Data",
        "audit": "Buk me Kweno"
      }
    }
  },
  Runyankole: {
    translation: {
      "nav": {
        "home": "Oruka",
        "recruitment": "Okusherura Abakozi",
        "ethics": "Micwe",
        "privacy": "Ensita",
        "dashboard": "Ah'okwebembera",
        "login": "Taamu",
        "logout": "Shohora"
      },
      "hero": {
        "badge": "Okukuuma Data mu Uganda",
        "title": "Omulyango gw'Okufuna Amazima ga Data",
        "subtitle": "StatGate ekuwa omusingi omunywevu gw'okuddukanya abakozi b'o mu kisaawe.",
        "cta_agent": "Yingira nga Omukozi",
        "cta_vendor": "Portal y'Abatunzi"
      },
      "dashboard": {
        "title": "StatGate Dashboard",
        "overview": "Okureeba Kwona",
        "sync": "Sovereign Sync",
        "agents": "Abakozi b'o mu Kisaawe",
        "reports": "Ripoota z'e Disiturikiti",
        "fellowship": "Obumu",
        "sandbox": "Sandbox ya Data",
        "audit": "Ebitabo by'Okubala"
      }
    }
  },
  Lusoga: {
    translation: {
      "nav": {
        "home": "Eka",
        "recruitment": "Okunoonya Abakozi",
        "ethics": "Empisa",
        "privacy": "Ekyama",
        "dashboard": "Ah'okwebembera",
        "login": "Ingira",
        "logout": "Ffuluma"
      },
      "hero": {
        "badge": "Okukuuma Data mu Uganda",
        "title": "Omulyango gw'Okufuna Amazima ga Data",
        "subtitle": "StatGate ekuwa omusingi omunywevu gw'okuddukanya abakozi b'o mu kisaawe.",
        "cta_agent": "Ingira nga Omukozi",
        "cta_vendor": "Portal y'Abatunzi"
      },
      "dashboard": {
        "title": "StatGate Dashboard",
        "overview": "Okulaba Okwawamu",
        "sync": "Sovereign Sync",
        "agents": "Abakozi b'o mu Kisaawe",
        "reports": "Alipoota z'e Disitulikiti",
        "fellowship": "Obumu",
        "sandbox": "Sandbox ya Data",
        "audit": "Ebitabo by'Okubala"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'English',
    fallbackLng: 'English',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
