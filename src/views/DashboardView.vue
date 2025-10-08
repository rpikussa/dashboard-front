<template>
  <div class="dashboard-container">
    <el-container>
      <!-- Sidebar -->
      <el-aside width="200px" class="sidebar">
        <!--
        <div class="logo">
          <h3>Financial Dashboard</h3>
        </div>
        -->
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><House /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>Usuários</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>Configurações</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Main Content -->
      <el-container>
        <!-- Header -->
        <el-header class="header">
          <HeaderBar :title="appTitle" />
        </el-header>

        <!-- Content -->
        <el-main class="main-content">
          <div class="stats-cards">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-card class="stat-card">
                  <div class="stat-content">
                    <div class="stat-icon">
                      <el-icon><User /></el-icon>
                    </div>
                    <div class="stat-info">
                      <h3>1,234</h3>
                      <p>Usuários</p>
                    </div>
                  </div>
                </el-card>
              </el-col>
              
              <el-col :span="6">
                <el-card class="stat-card">
                  <div class="stat-content">
                    <div class="stat-icon">
                      <el-icon><Document /></el-icon>
                    </div>
                    <div class="stat-info">
                      <h3>567</h3>
                      <p>Documentos</p>
                    </div>
                  </div>
                </el-card>
              </el-col>
              
              <el-col :span="6">
                <el-card class="stat-card">
                  <div class="stat-content">
                    <div class="stat-icon">
                      <el-icon><TrendCharts /></el-icon>
                    </div>
                    <div class="stat-info">
                      <h3>89%</h3>
                      <p>Performance</p>
                    </div>
                  </div>
                </el-card>
              </el-col>
              
              <el-col :span="6">
                <el-card class="stat-card">
                  <div class="stat-content">
                    <div class="stat-icon">
                      <el-icon><Money /></el-icon>
                    </div>
                    <div class="stat-info">
                      <h3>R$ 12K</h3>
                      <p>Receita</p>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <!-- Debug Info (apenas em desenvolvimento) -->
          <div v-if="isDev" class="debug-info">
            <el-card>
              <template #header>
                <span>🔧 Debug Info</span>
              </template>
              <div class="debug-content">
                <p><strong>Ambiente:</strong> {{ environment }}</p>
                <p><strong>Versão:</strong> {{ appVersion }}</p>
                <p><strong>API URL:</strong> {{ apiUrl }}</p>
                <p><strong>Modo:</strong> {{ mode }}</p>
              </div>
            </el-card>
          </div>

          <!-- Charts Section -->
          <el-row :gutter="20" class="charts-section">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>Estatísticas Mensais</span>
                </template>
                <div class="chart-placeholder">
                  <p>Gráfico será implementado aqui</p>
                </div>
              </el-card>
            </el-col>
            
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>Atividades Recentes</span>
                </template>
                <div class="activities-list">
                  <div class="activity-item">
                    <el-icon><User /></el-icon>
                    <span>Novo usuário registrado</span>
                    <span class="time">2h atrás</span>
                  </div>
                  <div class="activity-item">
                    <el-icon><Document /></el-icon>
                    <span>Documento atualizado</span>
                    <span class="time">4h atrás</span>
                  </div>
                  <div class="activity-item">
                    <el-icon><Setting /></el-icon>
                    <span>Configuração alterada</span>
                    <span class="time">1d atrás</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  House,
  User,
  Setting,
  Document,
  TrendCharts,
  Money
} from '@element-plus/icons-vue'
import HeaderBar from '@/components/HeaderBar.vue'
import { configService } from '@/services/config'

const route = useRoute()
const activeMenu = ref(route.path)

// Configurações da aplicação
const appTitle = configService.getAppTitle()
const appVersion = configService.getAppVersion()
const environment = configService.getEnvironment()
const apiUrl = configService.getApiUrl()
const mode = configService.get('MODE')
const isDev = configService.isDevelopment()

// Log das configurações em desenvolvimento
if (isDev) {
  console.log('📊 Dashboard carregado:', {
    title: appTitle,
    version: appVersion,
    environment,
    apiUrl
  })
}
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  color: white;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #434a5f;
}

.logo h3 {
  color: white;
  margin: 0;
}

.sidebar-menu {
  border: none;
  background-color: transparent;
}

.sidebar-menu .el-menu-item {
  color: #bfcbd9;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #434a5f;
  color: white;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #409eff;
  color: white;
}

.header {
  height: 60px;
  padding: 0;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.stat-card :deep(.el-card__body) {
  padding: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.stat-info p {
  margin: 5px 0 0 0;
  opacity: 0.9;
}

.charts-section {
  margin-top: 20px;
}

.debug-info {
  margin-bottom: 20px;
}

.debug-content {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.debug-content p {
  margin: 5px 0;
  padding: 2px 0;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #999;
}

.activities-list {
  height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.time {
  margin-left: auto;
  color: #999;
  font-size: 0.9rem;
}
</style>