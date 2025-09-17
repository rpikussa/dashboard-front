import { defineStore } from 'pinia'
import { authService } from '@/services/authService.js'
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
                const result = await authService.login(email, password)

                if (result.success) {
                    this.isAuthenticated = true
                    // Buscar dados do usuário se necessário
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
                return await authService.register(userData)
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.user = null
            this.isAuthenticated = false
            authService.logout()
        },

        checkAuth() {
            this.isAuthenticated = authService.isAuthenticated()
        }
    }
})