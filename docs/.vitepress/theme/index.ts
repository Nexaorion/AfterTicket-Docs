import DefaultTheme from 'vitepress/theme'
import DownloadPage from './components/DownloadPage.vue'
import SpeedInsights from './components/SpeedInsights.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(SpeedInsights)
    })
  },
  enhanceApp({ app }) {
    app.component('DownloadPage', DownloadPage)
  },
}
