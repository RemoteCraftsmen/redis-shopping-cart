module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "configureWebpack": {
    "resolve": {
      "alias": {
        "@": "/Users/lukasz/Projects/Other/redis-shopping-cart/client/src"
      }
    }
  },
  "pluginOptions": {
    "i18n": {
      "locale": "en",
      "fallbackLocale": "en",
      "localeDir": "locales",
      "enableInSFC": true
    }
  }
}