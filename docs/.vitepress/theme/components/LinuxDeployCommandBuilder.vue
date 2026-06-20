<template>
  <div class="deploy-builder">
    <div class="builder-header">
      <div>
        <h2>生成安装命令</h2>
        <p>填写 Node Token 和运行模式后，页面会在本地生成可复制的 Linux 部署命令。</p>
      </div>
    </div>

    <div class="builder-grid">
      <label class="field field-wide">
        <span>Node Token</span>
        <input
          v-model.trim="nodeToken"
          :type="showToken ? 'text' : 'password'"
          autocomplete="off"
          spellcheck="false"
          placeholder="粘贴你的 Node Token"
        />
      </label>

      <label class="field">
        <span>运行模式</span>
        <select v-model="mode">
          <option value="cluster">集群节点模式</option>
          <option value="standalone">单机模式</option>
        </select>
      </label>

      <label class="field">
        <span>节点名称</span>
        <input
          v-model.trim="nodeName"
          autocomplete="off"
          spellcheck="false"
          placeholder="可选，仅集群模式使用"
          :disabled="mode !== 'cluster'"
        />
      </label>

      <label class="field field-wide">
        <span>Master 地址</span>
        <input v-model.trim="masterUrl" autocomplete="off" spellcheck="false" />
      </label>

      <label class="field field-wide">
        <span>Updater API Base URL</span>
        <input v-model.trim="updaterUrl" autocomplete="off" spellcheck="false" />
      </label>
    </div>

    <div class="builder-options">
      <label class="checkbox-line">
        <input v-model="downloadFirst" type="checkbox" />
        <span>包含脚本下载步骤</span>
      </label>
      <label class="checkbox-line">
        <input v-model="showToken" type="checkbox" />
        <span>在输入框中显示 Token</span>
      </label>
      <label v-if="mode === 'cluster'" class="checkbox-line">
        <input v-model="noStart" type="checkbox" />
        <span>安装服务但不立即启动</span>
      </label>
    </div>

    <div class="notice">
      Node Token 只用于当前浏览器页面生成命令，不会被发送到 AfterTicket Docs 或更新服务。请不要把生成后的命令发到公开环境。
    </div>

    <div class="command-block">
      <div class="command-toolbar">
        <span>{{ mode === 'cluster' ? '集群节点部署命令' : '单机模式部署命令' }}</span>
        <button type="button" @click="copyCommand">
          {{ copied ? '已复制' : '复制' }}
        </button>
      </div>
      <pre><code>{{ generatedCommand }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const SCRIPT_URL = 'https://apac.r2.static.isla.fan/public/afterticket/install-afterticket-linux.sh'
const DEFAULT_MASTER_URL = 'https://api.afterticket.org'
const DEFAULT_UPDATER_URL = 'https://updater.afterticket.org/api/v1'

const nodeToken = ref('')
const mode = ref('cluster')
const nodeName = ref('')
const masterUrl = ref(DEFAULT_MASTER_URL)
const updaterUrl = ref(DEFAULT_UPDATER_URL)
const downloadFirst = ref(true)
const showToken = ref(false)
const noStart = ref(false)
const copied = ref(false)

function shellQuote(value) {
  const text = String(value || '')
  if (!text) return "''"
  return `'${text.replace(/'/g, `'\"'\"'`)}'`
}

function normalizeUrl(value, fallback) {
  const text = String(value || '').trim()
  return (text || fallback).replace(/\/+$/, '')
}

const generatedCommand = computed(() => {
  const token = nodeToken.value || '你的_NODE_TOKEN'
  const safeMaster = normalizeUrl(masterUrl.value, DEFAULT_MASTER_URL)
  const safeUpdater = normalizeUrl(updaterUrl.value, DEFAULT_UPDATER_URL)
  const lines = []

  if (downloadFirst.value) {
    lines.push(`curl -fsSLO ${SCRIPT_URL}`)
    lines.push('chmod +x install-afterticket-linux.sh')
    lines.push('')
  }

  if (mode.value === 'cluster') {
    const clusterLines = [
      'sudo sh install-afterticket-linux.sh',
      '  --mode cluster',
      `  --token ${shellQuote(token)}`,
      `  --master ${shellQuote(safeMaster)}`,
      `  --updater-url ${shellQuote(safeUpdater)}`,
    ]
    if (nodeName.value) {
      clusterLines.push(`  --name ${shellQuote(nodeName.value)}`)
    }
    if (noStart.value) {
      clusterLines.push('  --no-start')
    }
    lines.push(clusterLines.join(' \\\n'))
  } else {
    lines.push([
      'sh install-afterticket-linux.sh',
      '  --mode standalone',
      `  --token ${shellQuote(token)}`,
      `  --master ${shellQuote(safeMaster)}`,
      `  --updater-url ${shellQuote(safeUpdater)}`,
      '  --no-service',
    ].join(' \\\n'))
  }

  return lines.join('\n')
})

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(generatedCommand.value)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1600)
  } catch {
    copied.value = false
  }
}
</script>

<style scoped>
.deploy-builder {
  margin: 24px 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.builder-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.builder-header h2 {
  margin: 0 0 6px;
  border: 0;
  padding: 0;
  font-size: 1.35rem;
}

.builder-header p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
}

.builder-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-wide {
  grid-column: 1 / -1;
}

.field span {
  color: var(--vp-c-text-2);
  font-size: 0.86rem;
  font-weight: 600;
}

.field input,
.field select {
  min-height: 40px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0 11px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.92rem;
}

.field input:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.builder-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin-top: 16px;
}

.checkbox-line {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
}

.notice {
  margin-top: 16px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-warning-2);
  border-radius: 8px;
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-text-1);
  font-size: 0.86rem;
  line-height: 1.6;
}

.command-block {
  margin-top: 16px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-code-block-bg);
}

.command-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  font-weight: 600;
}

.command-toolbar button {
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 7px;
  padding: 4px 11px;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  cursor: pointer;
}

.command-toolbar button:hover {
  background: var(--vp-c-brand-soft);
}

pre {
  margin: 0;
  padding: 14px;
  overflow-x: auto;
  background: transparent;
}

code {
  white-space: pre;
  font-size: 0.86rem;
}

@media (max-width: 640px) {
  .deploy-builder {
    padding: 16px;
  }

  .builder-grid {
    grid-template-columns: 1fr;
  }
}
</style>
