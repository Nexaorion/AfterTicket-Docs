import DefaultTheme from 'vitepress/theme'
import DownloadPage from './components/DownloadPage.vue'
import LinuxDeployCommandBuilder from './components/LinuxDeployCommandBuilder.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DownloadPage', DownloadPage)
    app.component('LinuxDeployCommandBuilder', LinuxDeployCommandBuilder)
  },
}
