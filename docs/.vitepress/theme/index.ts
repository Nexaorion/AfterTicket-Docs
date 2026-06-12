import DefaultTheme from 'vitepress/theme'
import DownloadPage from './components/DownloadPage.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DownloadPage', DownloadPage)
  },
}
