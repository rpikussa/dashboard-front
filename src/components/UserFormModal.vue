<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
    :before-close="handleClose"
    class="user-form-dialog"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="loading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Nome" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="Digite o nome completo"
              :prefix-icon="User"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="Email" prop="email">
            <el-input
              v-model="formData.email"
              type="email"
              placeholder="Digite o email"
              :prefix-icon="Message"
              :disabled="mode === 'edit'"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="mode === 'create'">
        <el-col :span="12">
          <el-form-item label="Senha" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="Digite a senha"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="Confirmar Senha" prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirme a senha"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Função" prop="role">
            <el-select
              v-model="formData.role"
              placeholder="Selecione a função"
              style="width: 100%"
            >
              <el-option label="Usuário" value="user" />
              <el-option label="Gerente" value="manager" />
              <el-option label="Admin" value="admin" />
              <el-option label="Convidado" value="guest" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="Status" prop="status">
            <el-select
              v-model="formData.status"
              placeholder="Selecione o status"
              style="width: 100%"
            >
              <el-option label="Ativo" value="active" />
              <el-option label="Inativo" value="inactive" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Telefone" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="Digite o telefone"
              :prefix-icon="Phone"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="Departamento" prop="department">
            <el-input
              v-model="formData.department"
              placeholder="Digite o departamento"
              :prefix-icon="OfficeBuilding"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Bio/Observações" prop="bio">
        <el-input
          v-model="formData.bio"
          type="textarea"
          :rows="3"
          placeholder="Informações adicionais sobre o usuário"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancelar</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="loading"
        >
          {{ mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  User,
  Message,
  Lock,
  Phone,
  OfficeBuilding
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/users.js'
import { configService } from '@/services/config.js'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create', // 'create' | 'edit'
    validator: (value) => ['create', 'edit'].includes(value)
  }
})

// Emits
const emit = defineEmits(['update:visible', 'saved'])

// Store
const userStore = useUserStore()

// Refs
const formRef = ref(null)
const loading = ref(false)

// Form data
const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  status: 'active',
  phone: '',
  department: '',
  bio: ''
})

// Computed
const dialogVisible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})

const dialogTitle = computed(() => {
  return props.mode === 'create' ? 'Criar Novo Usuário' : 'Editar Usuário'
})

const isDev = computed(() => configService.isDevelopment())

// Form validation rules
const formRules = computed(() => {
  const baseRules = {
    name: [
      { required: true, message: 'Nome é obrigatório', trigger: 'blur' },
      { min: 2, max: 100, message: 'Nome deve ter entre 2 e 100 caracteres', trigger: 'blur' }
    ],
    email: [
      { required: true, message: 'Email é obrigatório', trigger: 'blur' },
      { type: 'email', message: 'Email inválido', trigger: 'blur' }
    ],
    role: [
      { required: true, message: 'Função é obrigatória', trigger: 'change' }
    ],
    status: [
      { required: true, message: 'Status é obrigatório', trigger: 'change' }
    ]
  }

  // Adicionar regras de senha apenas para criação
  if (props.mode === 'create') {
    baseRules.password = [
      { required: true, message: 'Senha é obrigatória', trigger: 'blur' },
      { min: 6, message: 'Senha deve ter pelo menos 6 caracteres', trigger: 'blur' }
    ]

    baseRules.confirmPassword = [
      { required: true, message: 'Confirmação de senha é obrigatória', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== formData.value.password) {
            callback(new Error('Senhas não coincidem'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }

  return baseRules
})

// Watchers
watch(() => props.visible, (newVal) => {
  if (newVal) {
    initializeForm()
  } else {
    resetForm()
  }
})

watch(() => props.user, (newVal) => {
  if (newVal && props.visible) {
    initializeForm()
  }
})

// Methods
const initializeForm = async () => {
  await nextTick()
  
  if (props.mode === 'edit' && props.user) {
    // Modo edição - carregar dados do usuário
    formData.value = {
      name: props.user.name || '',
      email: props.user.email || '',
      password: '',
      confirmPassword: '',
      role: props.user.role || 'user',
      status: props.user.status || 'active',
      phone: props.user.phone || '',
      department: props.user.department || '',
      bio: props.user.bio || ''
    }
    
    if (isDev.value) {
      console.log('📝 UserFormModal: Carregado dados para edição:', props.user.id)
    }
  } else {
    // Modo criação - formulário limpo
    resetFormData()
    
    if (isDev.value) {
      console.log('📝 UserFormModal: Formulário preparado para criação')
    }
  }

  // Limpar validações anteriores
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const resetFormData = () => {
  formData.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    status: 'active',
    phone: '',
    department: '',
    bio: ''
  }
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  resetFormData()
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    // Validar formulário
    await formRef.value.validate()
    
    loading.value = true

    // Preparar dados para envio
    const userData = {
      name: formData.value.name.trim(),
      email: formData.value.email.trim(),
      role: formData.value.role,
      status: formData.value.status,
      phone: formData.value.phone.trim(),
      department: formData.value.department.trim(),
      bio: formData.value.bio.trim()
    }

    // Adicionar senha apenas para criação
    if (props.mode === 'create') {
      userData.password = formData.value.password
    }

    let result

    if (props.mode === 'create') {
      result = await userStore.createUser(userData)
    } else {
      result = await userStore.updateUser(props.user.id, userData)
    }

    if (result.success) {
      ElMessage.success(
        props.mode === 'create' 
          ? 'Usuário criado com sucesso!' 
          : 'Usuário atualizado com sucesso!'
      )
      
      emit('saved')
      dialogVisible.value = false
    } else {
      ElMessage.error(result.message)
    }

  } catch (error) {
    if (isDev.value) {
      console.error('❌ UserFormModal: Erro na validação:', error)
    }
    ElMessage.error('Verifique os dados do formulário')
  } finally {
    loading.value = false
  }
}

// Debug info
if (isDev.value) {
  console.log('📝 UserFormModal: Componente inicializado')
}
</script>

<style scoped>
.user-form-dialog :deep(.el-dialog__header) {
  background-color: #f8f9fa;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e9ecef;
}

.user-form-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.user-form-dialog :deep(.el-dialog__footer) {
  background-color: #f8f9fa;
  padding: 16px 24px 20px;
  border-top: 1px solid #e9ecef;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Responsividade */
@media (max-width: 768px) {
  .user-form-dialog {
    margin: 20px;
    width: calc(100% - 40px) !important;
    max-width: none !important;
  }
}
</style>