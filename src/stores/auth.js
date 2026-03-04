import { defineStore } from 'pinia'
import { authService } from '@/services/authService.js'
import { userService } from '@/services/userService.js'
import { jwtHelper } from '@/services/jwtHelper.js'
import { configService } from '@/services/config.js'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        userLoading: false
    }),

    getters: {
        getUser: (state) => state.user,
        isLoggedIn: (state) => state.isAuthenticated,
        
        // Informações básicas do token JWT
        getTokenInfo: () => jwtHelper.getCurrentUserInfo(),
        
        // ID do usuário a partir do token
        getUserId: () => jwtHelper.getCurrentUserId(),
        
        // Tempo restante do token
        getTokenTimeRemaining: () => jwtHelper.getTokenTimeRemainingFormatted(),
        
        // Verificar se token está expirado
        isTokenExpired: () => jwtHelper.isTokenExpired()
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
                    
                    // Carregar dados completos do usuário após login bem-sucedido
                    await this.loadCurrentUser()
                    
                    if (configService.isDevelopment()) {
                        console.log('✅ Store: Login bem-sucedido')
                        jwtHelper.logDebugInfo()
                    }
                    return { success: true }
                }

                return result
            } finally {
                this.loading = false
            }
        },

        async loadCurrentUser() {
            this.userLoading = true
            try {
                if (configService.isDevelopment()) {
                    console.log('👤 Store: Carregando dados do usuário atual...')
                }

                const result = await userService.getCurrentUser()
                
                if (result.success) {
                    this.user = result.data
                    
                    if (configService.isDevelopment()) {
                        console.log('✅ Store: Dados do usuário carregados:', this.user.name || this.user.email)
                    }
                } else {
                    // Se não conseguir carregar dados do usuário, usar informações do token
                    const tokenInfo = jwtHelper.getCurrentUserInfo()
                    if (tokenInfo) {
                        this.user = {
                            id: tokenInfo.id,
                            email: tokenInfo.email,
                            name: tokenInfo.name,
                            role: tokenInfo.role
                        }
                        
                        if (configService.isDevelopment()) {
                            console.log('✅ Store: Usando dados do token JWT como fallback')
                        }
                    }
                }
            } catch (error) {
                console.error('❌ Store: Erro ao carregar usuário:', error)
                
                // Fallback para informações do token
                const tokenInfo = jwtHelper.getCurrentUserInfo()
                if (tokenInfo) {
                    this.user = {
                        id: tokenInfo.id,
                        email: tokenInfo.email,
                        name: tokenInfo.name,
                        role: tokenInfo.role
                    }
                }
            } finally {
                this.userLoading = false
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
            
            // Se autenticado mas sem dados do usuário, carregar
            if (this.isAuthenticated && !this.user) {
                this.loadCurrentUser()
            }
            
            // Se não autenticado, limpar dados do usuário
            if (!this.isAuthenticated) {
                this.user = null
            }
            
            if (configService.isDevelopment() && wasAuthenticated !== this.isAuthenticated) {
                console.log('🔍 Store: Status de autenticação alterado:', {
                    antes: wasAuthenticated,
                    agora: this.isAuthenticated
                })
                
                if (this.isAuthenticated) {
                    jwtHelper.logDebugInfo()
                }
            }
        },

        // Método para verificar e renovar autenticação
        async refreshAuth() {
            if (configService.isDevelopment()) {
                console.log('🔄 Store: Verificando e renovando autenticação...')
            }

            if (jwtHelper.isTokenExpired()) {
                if (configService.isDevelopment()) {
                    console.warn('⏰ Store: Token expirado, fazendo logout...')
                }
                this.logout()
                return false
            }

            if (this.isAuthenticated && !this.user) {
                await this.loadCurrentUser()
            }

            return this.isAuthenticated
        },

        // Informações de debug sobre o estado de autenticação
        getAuthDebugInfo() {
            if (!configService.isDevelopment()) return null

            return {
                storeAuthenticated: this.isAuthenticated,
                hasUser: !!this.user,
                userLoading: this.userLoading,
                tokenInfo: jwtHelper.getCurrentUserInfo(),
                tokenExpired: jwtHelper.isTokenExpired(),
                tokenTimeRemaining: jwtHelper.getTokenTimeRemainingFormatted()
            }
        }
    }
})