import api from './api.js'
import Cookies from 'js-cookie'
import { configService } from './config.js'

export const authService = {
    async login(email, password) {
        try {
            console.log('🔐 Tentando fazer login...')
            const response = await api.post('/auth/login', { email, password })
            const { token } = response.data

            if (token) {
                const cookieConfig = configService.getCookieConfig()
                Cookies.set('auth_token', token, { 
                    expires: cookieConfig.tokenExpiry,
                    secure: cookieConfig.secure,
                    sameSite: cookieConfig.sameSite
                })
                
                console.log('✅ Login realizado com sucesso')
                return { success: true, data: response.data }
            }

            console.warn('⚠️ Token não recebido na resposta')
            return { success: false, message: 'Token não recebido' }
        } catch (error) {
            console.error('❌ Erro no login:', error.response?.data || error.message)
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao fazer login'
            }
        }
    },

    async register(userData) {
        try {
            console.log('📝 Tentando registrar usuário...')
            const response = await api.post('/auth/register', userData)
            console.log('✅ Usuário registrado com sucesso')
            return { success: true, data: response.data }
        } catch (error) {
            console.error('❌ Erro no registro:', error.response?.data || error.message)
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao registrar usuário'
            }
        }
    },

    async getUser(id) {
        try {
            console.log(`👤 Buscando usuário ${id}...`)
            const response = await api.get(`/auth/user/${id}`)
            console.log('✅ Usuário encontrado')
            return { success: true, data: response.data }
        } catch (error) {
            console.error('❌ Erro ao buscar usuário:', error.response?.data || error.message)
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao buscar usuário'
            }
        }
    },

    logout() {
        console.log('🔓 Fazendo logout...')
        Cookies.remove('auth_token')
        console.log('✅ Logout realizado, redirecionando...')
        window.location.href = '/login'
    },

    isAuthenticated() {
        const hasToken = !!Cookies.get('auth_token')
        if (configService.isDevelopment()) {
            console.log('🔍 Verificando autenticação:', { hasToken })
        }
        return hasToken
    }
}