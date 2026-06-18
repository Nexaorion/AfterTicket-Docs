<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { injectSpeedInsights } from '@vercel/speed-insights'

onMounted(() => {
  // Inject Speed Insights on the client side
  injectSpeedInsights()
})
</script>
