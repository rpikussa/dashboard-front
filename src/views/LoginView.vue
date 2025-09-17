<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>Dashboard Login</h2>
        <p>Entre com suas credenciais</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            type="email"
            placeholder="Email"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Senha"
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
            @click="handleLogin"
            class="login-button"
          >
            Entrar
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <router-link to="/register">Não tem conta? Registre-se</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()
const loginFormRef = ref()

const loginForm = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Email é obrigatório', trigger: 'blur' },
    { type: 'email', message: 'Email inválido', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Senha é obrigatória', trigger: 'blur' },
    { min: 6, message: 'Senha deve ter pelo menos 6 caracteres', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      const result = await authStore.login(loginForm.email, loginForm.password)
      
      if (result.success) {
        ElMessage.success('Login realizado com sucesso!')
        router.push('/dashboard')
      } else {
        ElMessage.error(result.message || 'Erro ao fazer login')
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #666;
  margin: 0;
}

.login-form {
  margin-bottom: 1rem;
}

.login-button {
  width: 100%;
}

.login-footer {
  text-align: center;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>