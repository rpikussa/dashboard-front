<template>
  <div class="header-content">
    <div class="header-left">
      <h2>{{ title }}</h2>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <span class="user-info">
          <el-icon><User /></el-icon>
          {{ userName || 'Usuário' }}
          <el-icon><CaretBottom /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">Perfil</el-dropdown-item>
            <el-dropdown-item command="logout">Sair</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, CaretBottom } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth.js'
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

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      if (configService.isDevelopment()) {
        console.log('👤 Navegando para perfil...')
      }
      router.push('/profile')
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