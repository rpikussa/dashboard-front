<template>
  <div class="users-container">
    <el-container>
      <!-- Sidebar -->
      <el-aside width="200px" class="sidebar">
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
          <HeaderBar title="Gerenciar Usuários" />
        </el-header>

        <!-- Content -->
        <el-main class="main-content">
          <!-- Toolbar -->
          <div class="toolbar">
            <div class="toolbar-left">
              <el-button 
                type="primary" 
                @click="handleCreate"
                :icon="Plus"
              >
                Novo Usuário
              </el-button>
              <el-button 
                @click="refreshUsers"
                :icon="Refresh"
                :loading="userStore.loading"
              >
                Atualizar
              </el-button>
              <el-button 
                v-if="isDev"
                @click="showApiLimitations"
                :icon="InfoFilled"
                type="warning"
                plain
              >
                API Info
              </el-button>
            </div>
            
            <div class="toolbar-right">
              <el-input
                v-model="searchQuery"
                placeholder="Pesquisar usuários..."
                :prefix-icon="Search"
                @input="handleSearch"
                @clear="handleClearSearch"
                clearable
                style="width: 300px"
              />
            </div>
          </div>

          <!-- API Limitations Alert (Development only) -->
          <el-alert
            v-if="isDev"
            title="⚠️ Modo de Desenvolvimento - Dados Simulados"
            type="warning"
            show-icon
            :closable="false"
            style="margin-bottom: 20px;"
          >
            <template #default>
              A API atual tem limitações. Algumas operações são simuladas localmente.
              <el-button type="text" @click="showApiLimitations" style="margin-left: 8px;">
                Ver detalhes
              </el-button>
            </template>
          </el-alert>

          <!-- Users Table -->
          <el-card class="table-card">
            <el-table
              :data="userStore.filteredUsers"
              v-loading="userStore.loading || userStore.searchLoading"
              stripe
              style="width: 100%"
              @sort-change="handleSortChange"
            >
              <el-table-column 
                prop="id" 
                label="ID" 
                width="80"
                sortable
              />
              
              <el-table-column 
                prop="name" 
                label="Nome"
                sortable
                min-width="150"
              >
                <template #default="{ row }">
                  <div class="user-info">
                    <el-avatar 
                      :size="32" 
                      :src="row.avatar"
                      :icon="UserFilled"
                    />
                    <span class="user-name">{{ row.name || 'Sem nome' }}</span>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column 
                prop="email" 
                label="Email"
                sortable
                min-width="200"
              />
              
              <el-table-column 
                prop="role" 
                label="Função"
                width="120"
              >
                <template #default="{ row }">
                  <el-tag 
                    :type="getRoleType(row.role)"
                    size="small"
                  >
                    {{ getRoleLabel(row.role) }}
                  </el-tag>
                </template>
              </el-table-column>
              
              <el-table-column 
                prop="status" 
                label="Status"
                width="100"
              >
                <template #default="{ row }">
                  <el-tag 
                    :type="row.status === 'active' ? 'success' : 'danger'"
                    size="small"
                  >
                    {{ row.status === 'active' ? 'Ativo' : 'Inativo' }}
                  </el-tag>
                </template>
              </el-table-column>
              
              <el-table-column 
                prop="createdAt" 
                label="Criado em"
                width="120"
                sortable
              >
                <template #default="{ row }">
                  {{ formatDate(row.createdAt) }}
                </template>
              </el-table-column>
              
              <el-table-column 
                label="Ações" 
                width="150"
                fixed="right"
              >
                <template #default="{ row }">
                  <el-button
                    size="small"
                    @click="handleEdit(row)"
                    :icon="Edit"
                  >
                    Editar
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(row)"
                    :icon="Delete"
                  >
                    Deletar
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- Pagination -->
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="userStore.pagination.current"
                v-model:page-size="userStore.pagination.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="userStore.pagination.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-card>
        </el-main>
      </el-container>
    </el-container>

    <!-- User Form Modal -->
    <UserFormModal
      v-model:visible="showModal"
      :user="selectedUser"
      :mode="modalMode"
      @saved="handleUserSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  House,
  User,
  Setting,
  Plus,
  Refresh,
  Search,
  Edit,
  Delete,
  UserFilled,
  InfoFilled
} from '@element-plus/icons-vue'
import HeaderBar from '@/components/HeaderBar.vue'
import UserFormModal from '@/components/UserFormModal.vue'
import { useUserStore } from '@/stores/users.js'
import { userService } from '@/services/userService.js'
import { configService } from '@/services/config.js'

const route = useRoute()
const userStore = useUserStore()

// Estado do componente
const activeMenu = ref(route.path)
const searchQuery = ref('')
const showModal = ref(false)
const selectedUser = ref(null)
const modalMode = ref('create') // 'create' | 'edit'

// Computed
const isDev = computed(() => configService.isDevelopment())

// Lifecycle
onMounted(async () => {
  if (isDev.value) {
    console.log('👥 UsersView: Componente montado, carregando usuários...')
    
    // Log limitações da API em desenvolvimento
    userService.logApiLimitations()
  }
  await loadUsers()
})

// Methods
const loadUsers = async () => {
  const result = await userStore.fetchUsers()
  if (!result.success) {
    ElMessage.error(result.message)
  }
}

const refreshUsers = async () => {
  await userStore.clearSearch()
  ElMessage.success('Lista de usuários atualizada!')
}

const handleSearch = (value) => {
  if (value.trim()) {
    userStore.searchUsers(value)
  } else {
    userStore.clearSearch()
  }
}

const handleClearSearch = () => {
  searchQuery.value = ''
  userStore.clearSearch()
}

const handleCreate = () => {
  selectedUser.value = null
  modalMode.value = 'create'
  showModal.value = true
}

const handleEdit = (user) => {
  selectedUser.value = { ...user }
  modalMode.value = 'edit'
  showModal.value = true
}

const handleDelete = async (user) => {
  try {
    await ElMessageBox.confirm(
      `Tem certeza que deseja deletar o usuário "${user.name || user.email}"?`,
      'Confirmar Exclusão',
      {
        confirmButtonText: 'Deletar',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    const result = await userStore.deleteUser(user.id)
    
    if (result.success) {
      ElMessage.success('Usuário deletado com sucesso!')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    // User cancelled deletion
    if (error !== 'cancel') {
      ElMessage.error('Erro ao deletar usuário')
    }
  }
}

const handleUserSaved = () => {
  showModal.value = false
  selectedUser.value = null
  // Recarregar lista após salvar
  loadUsers()
}

const showApiLimitations = () => {
  const limitations = userService.getApiLimitations()
  
  const content = `
    <div style="text-align: left; max-height: 400px; overflow-y: auto;">
      <h4>📍 Endpoints Disponíveis:</h4>
      <ul>
        ${limitations.availableEndpoints.map(endpoint => `<li>${endpoint}</li>`).join('')}
      </ul>
      
      <h4>❌ Endpoints em Falta:</h4>
      <ul>
        ${limitations.missingEndpoints.map(endpoint => `<li>${endpoint}</li>`).join('')}
      </ul>
      
      <h4>🔧 Operações Simuladas:</h4>
      <ul>
        ${limitations.simulatedOperations.map(op => `<li>${op}</li>`).join('')}
      </ul>
      
      <h4>💡 Recomendações:</h4>
      <ul>
        ${limitations.recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    </div>
  `
  
  ElMessageBox.alert(content, 'Limitações da API Atual', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: 'Entendi'
  })
}

const handleSortChange = ({ column, prop, order }) => {
  if (isDev.value) {
    console.log('📊 Ordenação alterada:', { prop, order })
  }
  // Implementar ordenação se necessário
}

const handleCurrentChange = (page) => {
  userStore.setPage(page)
}

const handleSizeChange = (size) => {
  userStore.setPageSize(size)
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return '-'
  }
}

const getRoleType = (role) => {
  const types = {
    admin: 'danger',
    manager: 'warning',
    user: 'info',
    guest: ''
  }
  return types[role] || 'info'
}

const getRoleLabel = (role) => {
  const labels = {
    admin: 'Admin',
    manager: 'Gerente',
    user: 'Usuário',
    guest: 'Convidado'
  }
  return labels[role] || role || 'Usuário'
}

// Debug info
if (isDev.value) {
  console.log('👥 UsersView: Componente inicializado')
}
</script>

<style scoped>
.users-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  color: white;
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

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 4px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.table-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-weight: 500;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 0 4px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .toolbar-right {
    width: 100%;
  }
  
  .toolbar-right .el-input {
    width: 100% !important;
  }
}
</style>