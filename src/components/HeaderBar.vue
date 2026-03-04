<template>
  <div class="header-content">
    <div class="header-left">
      <h2>{{ title }}</h2>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <span class="user-info">
          <el-icon><User /></el-icon>
          {{ displayUserName }}
          <el-icon><CaretBottom /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">Perfil</el-dropdown-item>
            <el-dropdown-item command="token-info" v-if="isDev">Token Info</el-dropdown-item>
            <el-dropdown-item divided command="logout">Sair</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, CaretBottom } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth.js'
import { jwtHelper } from '@/services/jwtHelper.js'
import { configService } from '@/services/config'

// Props para personalizar o componente
const props = defineProps({
  title: {
    type: String,
    default: configService.getAppTitle()
  },
  userName: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const authStore = useAuthStore()

// Computed
const isDev = computed(() => configService.isDevelopment())

const displayUserName = computed(() => {
  // Prioridade: prop > store > token > fallback
  if (props.userName) return props.userName
  if (authStore.user?.name) return authStore.user.name
  if (authStore.user?.email) return authStore.user.email
  
  // Fallback para token JWT
  const tokenInfo = jwtHelper.getCurrentUserInfo()
  if (tokenInfo?.name) return tokenInfo.name
  if (tokenInfo?.email) return tokenInfo.email
  
  return 'Usuário'
})

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      if (configService.isDevelopment()) {
        console.log('👤 Navegando para perfil...')
      }
      router.push('/profile')
      break
      
    case 'token-info':
      if (configService.isDevelopment()) {
        showTokenInfo()
      }
      break
      
    case 'logout':
      if (configService.isDevelopment()) {
        console.log('🔓 Fazendo logout via header...')
      }
      authStore.logout()
      ElMessage.success('Logout realizado com sucesso!')
      break
  }
}

const showTokenInfo = () => {
  if (!configService.isDevelopment()) return
  
  const debugInfo = authStore.getAuthDebugInfo()
  const tokenInfo = jwtHelper.getCurrentUserInfo()
  
  const message = `
    <div style="text-align: left;">
      <h4>🔐 Informações do Token JWT</h4>
      <p><strong>Usuário:</strong> ${tokenInfo?.name || 'N/A'}</p>
      <p><strong>Email:</strong> ${tokenInfo?.email || 'N/A'}</p>
      <p><strong>ID:</strong> ${tokenInfo?.id || 'N/A'}</p>
      <p><strong>Role:</strong> ${tokenInfo?.role || 'N/A'}</p>
      <p><strong>Tempo restante:</strong> ${jwtHelper.getTokenTimeRemainingFormatted()}</p>
      <p><strong>Expirado:</strong> ${jwtHelper.isTokenExpired() ? 'Sim' : 'Não'}</p>
      <hr>
      <p><strong>Store autenticado:</strong> ${debugInfo?.storeAuthenticated ? 'Sim' : 'Não'}</p>
      <p><strong>Dados carregados:</strong> ${debugInfo?.hasUser ? 'Sim' : 'Não'}</p>
    </div>
  `
  
  ElMessageBox.alert(message, 'Debug: Token JWT', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: 'Fechar'
  })
}
</script>

<style scoped>
.header-content {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 100%;
  padding: 0 20px;
}

.header-left h2 {
  margin: 0;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #333;
}
</style>