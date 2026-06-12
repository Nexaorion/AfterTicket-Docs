<script setup>
import { inject } from '@vercel/analytics'
import { onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme

onMounted(() => {
  inject()
})
</script>

<template>
  <Layout />
</template>
