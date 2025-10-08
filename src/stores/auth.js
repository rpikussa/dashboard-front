import { defineStore } from 'pinia'
import { authService } from '@/services/authService.js'
import { configService } from '@/services/config.js'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false,
        loading: false
    }),

    getters: {
        getUser: (state) => state.user,
        isLoggedIn: (state) => state.isAuthenticated
    },

    actions: {
        async login(email, password) {
            this.loading = true
            try {
                if (configService.isDevelopment()) {
                    console.log('🔐 Store: Iniciando login...')
                }
                
                const result = await authService.login(email, password)

                if (result.success) {
                    this.isAuthenticated = true
                    if (configService.isDevelopment()) {
                        console.log('✅ Store: Login bem-sucedido')
                    }
                    return { success: true }
                }

                return result
            } finally {
                this.loading = false
            }
        },

        async register(userData) {
            this.loading = true
            try {
                if (configService.isDevelopment()) {
                    console.log('📝 Store: Iniciando registro...')
                }
                
                const result = await authService.register(userData)
                
                if (configService.isDevelopment()) {
                    console.log('✅ Store: Registro concluído:', result.success ? 'sucesso' : 'erro')
                }
                
                return result
            } finally {
                this.loading = false
            }
        },

        logout() {
            if (configService.isDevelopment()) {
                console.log('🔓 Store: Fazendo logout...')
            }
            
            this.user = null
            this.isAuthenticated = false
            authService.logout()
        },

        checkAuth() {
            const wasAuthenticated = this.isAuthenticated
            this.isAuthenticated = authService.isAuthenticated()
            
            if (configService.isDevelopment() && wasAuthenticated !== this.isAuthenticated) {
                console.log('🔍 Store: Status de autenticação alterado:', {
                    antes: wasAuthenticated,
                    agora: this.isAuthenticated
                })
            }
        }
    }
})