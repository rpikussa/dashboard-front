<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2>Criar Conta</h2>
        <p>Preencha os dados para registrar</p>
      </div>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="rules"
        class="register-form"
        @submit.prevent="handleRegister"
      >
        <el-form-item prop="name">
          <el-input
            v-model="registerForm.name"
            placeholder="Nome completo"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            type="email"
            placeholder="Email"
            :prefix-icon="Message"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="Senha"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Confirmar senha"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="authStore.loading"
            @click="handleRegister"
            class="register-button"
          >
            Registrar
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="register-footer">
        <router-link to="/login">Já tem conta? Faça login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth.js'
import { configService } from '@/services/config'

const router = useRouter()
const authStore = useAuthStore()
const registerFormRef = ref()

// Log de configuração em desenvolvimento
if (configService.isDevelopment()) {
  console.log('📝 RegisterView carregada:', {
    apiUrl: configService.getApiUrl(),
    environment: configService.getEnvironment()
  })
}

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('As senhas não coincidem'))
  } else {
    callback()
  }
}

const rules = {
  name: [
    { required: true, message: 'Nome é obrigatório', trigger: 'blur' },
    { min: 2, message: 'Nome deve ter pelo menos 2 caracteres', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Email é obrigatório', trigger: 'blur' },
    { type: 'email', message: 'Email inválido', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Senha é obrigatória', trigger: 'blur' },
    { min: 6, message: 'Senha deve ter pelo menos 6 caracteres', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Confirmação de senha é obrigatória', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      // Enviando dados com o campo confirmedpassword como esperado pelo backend
      const userData = {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        confirmedpassword: registerForm.confirmPassword
      }
      
      console.log('Dados enviados para o backend:', userData)
      const result = await authStore.register(userData)
      
      if (result.success) {
        ElMessage.success('Conta criada com sucesso! Faça login.')
        router.push('/login')
      } else {
        ElMessage.error(result.message || 'Erro ao criar conta')
      }
    }
  })
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-box {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #666;
  margin: 0;
}

.register-form {
  margin-bottom: 1rem;
}

.register-button {
  width: 100%;
}

.register-footer {
  text-align: center;
}

.register-footer a {
  color: #667eea;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>