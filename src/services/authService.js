import api from './api.js'
import Cookies from 'js-cookie'

export const authService = {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password })
            const { token } = response.data

            if (token) {
                Cookies.set('auth_token', token, { expires: 30/1440 }) // 30 minutos (30/1440 dias)
                return { success: true, data: response.data }
            }

            return { success: false, message: 'Token não recebido' }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao fazer login'
            }
        }
    },

    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao registrar usuário'
            }
        }
    },

    async getUser(id) {
        try {
            const response = await api.get(`/auth/user/${id}`)
            return { success: true, data: response.data }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao buscar usuário'
            }
        }
    },

    logout() {
        Cookies.remove('auth_token')
        window.location.href = '/login'
    },

    isAuthenticated() {
        return !!Cookies.get('auth_token')
    }
}