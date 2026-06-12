<template>
  <div class="download-page">
    <h1 class="download-title">下载 AfterTicket 客户端</h1>

    <div v-if="loading" class="status-box loading-box">
      <div class="spinner"></div>
      <p>正在获取版本信息…</p>
    </div>

    <div v-else-if="error" class="status-box error-box">
      <p class="error-icon">!</p>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchVersion">重试</button>
    </div>

    <template v-else>
      <div class="version-banner">
        <span class="version-tag">{{ versionInfo.latest_version }}</span>
        <span class="version-date">发布于 {{ formatDate(versionInfo.published_at) }}</span>
      </div>

      <div class="platform-grid">
        <div
          v-for="p in platforms"
          :key="p.key"
          class="platform-card"
          :class="{ unavailable: !getPlatform(p.key)?.available }"
        >
          <div class="platform-icon"><i :class="'fa-brands fa-' + p.faIcon"></i></div>
          <div class="platform-name">{{ p.label }}</div>

          <template v-if="getPlatform(p.key)?.available">
            <div class="platform-size">{{ formatSize(getPlatform(p.key).size) }}</div>
            <a class="download-btn" :href="downloadUrl(p.key)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v10M8 11L4 7M8 11l4-4M2 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              下载
            </a>
          </template>
          <template v-else>
            <div class="platform-size">&nbsp;</div>
            <span class="download-btn disabled">暂不可用</span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_BASE = '/api/v1'
const DOWNLOAD_BASE = 'https://updater.afterticket.org/api/v1'

const loading = ref(true)
const error = ref(null)
const versionInfo = ref(null)

const platforms = [
  {
    key: 'Linux',
    label: 'Linux',
    faIcon: 'linux',
  },
  {
    key: 'macOS-Apple_Silicon',
    label: 'macOS (Apple Silicon)',
    faIcon: 'apple',
  },
  {
    key: 'Windows.exe',
    label: 'Windows',
    faIcon: 'windows',
  },
]

function getPlatform(key) {
  return versionInfo.value?.platforms?.[key]
}

async function fetchVersion() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${API_BASE}/version`)
    if (!res.ok) {
      if (res.status === 503) throw new Error('暂无可用版本，请稍后再试')
      throw new Error(`请求失败 (${res.status})`)
    }
    versionInfo.value = await res.json()
  } catch (e) {
    error.value = e.message || '无法连接到更新服务'
  } finally {
    loading.value = false
  }
}

function downloadUrl(platform) {
  return `${DOWNLOAD_BASE}/download/${encodeURIComponent(platform)}`
}

function formatSize(bytes) {
  if (!bytes) return ''
  const mb = bytes / 1024 / 1024
  return mb >= 1024
    ? `${(mb / 1024).toFixed(2)} GB`
    : `${mb.toFixed(1)} MB`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(fetchVersion)
</script>

<style scoped>
.download-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.download-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.version-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.version-tag {
  background: var(--vp-c-brand-1);
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
}

.version-date {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (max-width: 640px) {
  .platform-grid {
    grid-template-columns: 1fr;
  }
}

.platform-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.25s, box-shadow 0.25s;
}

.platform-card:not(.unavailable):hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.platform-card.unavailable {
  opacity: 0.55;
}

.platform-icon {
  color: var(--vp-c-text-1);
  font-size: 2.5rem;
}

.platform-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.platform-size {
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  min-height: 1.2em;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.25rem;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  background: var(--vp-c-brand-1);
  color: #fff;
  transition: background 0.25s;
  cursor: pointer;
}

.download-btn:hover {
  background: var(--vp-c-brand-2);
  color: #fff;
}

.download-btn.disabled {
  background: var(--vp-c-divider);
  color: var(--vp-c-text-3);
  cursor: not-allowed;
  pointer-events: none;
}

.status-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  border-radius: 12px;
  text-align: center;
}

.loading-box {
  color: var(--vp-c-text-2);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-box {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
}

.error-icon {
  width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 50%;
  background: var(--vp-c-danger-1);
  color: #fff;
  font-weight: 700;
  font-size: 1.2rem;
}

.retry-btn {
  padding: 0.4rem 1rem;
  border: 1px solid var(--vp-c-danger-1);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-danger-1);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s;
}

.retry-btn:hover {
  background: var(--vp-c-danger-1);
  color: #fff;
}

.api-hint {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  text-align: center;
}

.api-hint p {
  margin: 0.25rem 0;
}

.api-hint code {
  background: var(--vp-c-mute);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>
