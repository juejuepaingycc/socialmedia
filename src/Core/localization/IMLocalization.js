import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance
import i18n from 'i18n-js';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

export const translationGetters = {
  KH: () => require('../../Translations/km.json'),
  TH: () => require('../../Translations/th.json'),
  CN: () => require('../../Translations/zh-cn.json'),
  EN: () => require('../../Translations/en.json'),
  MM: () => require('../../Translations/mm.json'),
  TW: () => require('../../Translations/zh-tw.json'),
};

export const IMLocalized = memoize(
  (key, config) =>
    i18n.t(key, config).includes('missing') ? key : i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = (lan) => {
  const fallback = { languageTag: lan, isRTL: false };
  let localeLanguageTag = Localization.locale;
  let isRTL = Localization.isRTL;

 //if (localeLanguageTag) {
    localeLanguageTag = lan;
    isRTL = false;
 // }

  IMLocalized.cache.clear();
  I18nManager.forceRTL(isRTL);
  i18n.translations = {
 [localeLanguageTag]: translationGetters[localeLanguageTag](),
    // KH: () => require('../../Translations/km.json'),
    // TH: () => require('../../Translations/th.json'),
    // CN: () => require('../../Translations/zh-cn.json'),
    // EN: () => require('../../Translations/en.json'),
    // MM: () => require('../../Translations/mm.json'),
    // TW: () => require('../../Translations/zh-tw.json'),
  }; 
  i18n.locale = localeLanguageTag;
};