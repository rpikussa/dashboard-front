<script setup>
import { RouterView } from 'vue-router'
import { configService } from '@/services/config'

// Configurar título da página
document.title = configService.getAppTitle()

// Log de inicialização em desenvolvimento
if (configService.isDevelopment()) {
  console.log('🚀 Aplicação iniciada:', {
    title: configService.getAppTitle(),
    version: configService.getAppVersion(),
    environment: configService.getEnvironment(),
    apiUrl: configService.getApiUrl()
  })
}
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
