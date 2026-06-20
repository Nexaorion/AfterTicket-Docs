import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import DownloadPage from './components/DownloadPage.vue'
import LinuxDeployCommandBuilder from './components/LinuxDeployCommandBuilder.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('DownloadPage', DownloadPage)
    app.component('LinuxDeployCommandBuilder', LinuxDeployCommandBuilder)
  },
}
