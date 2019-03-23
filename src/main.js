import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import messages from './language'

Vue.use(VueI18n)

let locale;
if (window.navigator.languages) {
  locale = window.navigator.languages[0]
} else {
  locale = window.navigator.userLanguage || window.navigator.language;
}
locale = locale.substr(0,2)

const i18n = new VueI18n({
  locale, // set locale
  messages, // set locale messages
  fallbackLocale: 'en'
})

Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
