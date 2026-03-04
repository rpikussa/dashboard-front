import api from './api.js'
import { configService } from './config.js'
import { jwtHelper } from './jwtHelper.js'

export const userService = {
    /**
     * Obtém dados do usuário atual a partir do token JWT
     */
    async getCurrentUser() {
        try {
            const userId = jwtHelper.getCurrentUserId()
            if (!userId) {
                return { success: false, message: 'Token JWT inválido ou usuário não identificado' }
            }

            if (configService.isDevelopment()) {
                console.log('👤 Buscando dados do usuário atual...', userId)
            }

            const response = await api.get(`/auth/user/${userId}`)

            if (configService.isDevelopment()) {
                console.log('✅ Dados do usuário atual carregados')
            }

            return { success: true, data: response.data }
        } catch (error) {
            console.error('❌ Erro ao buscar usuário atual:', error.response?.data || error.message)
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao carregar dados do usuário'
            }
        }
    },

    /**
     * Lista todos os usuários via GET /auth/users
     */
    async getUsers(params = {}) {
        try {
            if (configService.isDevelopment()) {
                console.log('👥 Buscando lista de usuários na API...', params)
            }

            const response = await api.get('/auth/users', { params })

            // A API retorna { data: [...], message: '...' }
            const users = response.data?.data ?? response.data

            if (configService.isDevelopment()) {
                console.log('✅ Lista de usuários carregada:', Array.isArray(users) ? users.length : 0, 'usuários')
            }

            return { success: true, data: users }
        } catch (error) {
            console.error('❌ Erro ao buscar usuários:', error.response?.data || error.message)
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao carregar usuários'
            }
        }
    },

    async getUser(id) {
        try {
            if (configService.isDevelopment()) {
                console.log(`👤 Buscando usuário ${id}...`)
            }

            const response = await api.get(`/auth/user/${id}`)

            if (configService.isDevelopment()) {
                console.log('✅ Usuário encontrado:', response.data.name || response.data.email)
            }

            return { success: true, data: response.data }
        } catch (error) {
            console.error('❌ Erro ao buscar usuário:', error.response?.data || error.message)
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao buscar usuário'
            }
        }
    },

    async createUser(userData) {
        try {
            if (configService.isDevelopment()) {
                console.log('👤 Criando novo usuário via registro...', userData.email)
            }

            // Usar endpoint de registro para criar usuário
            const response = await api.post('/auth/register', userData)

            if (configService.isDevelopment()) {
                console.log('✅ Usuário criado com sucesso')
            }

            return { success: true, data: response.data }
        } catch (error) {
            console.error('❌ Erro ao criar usuário:', error.response?.data || error.message)
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao criar usuário'
            }
        }
    },

    async updateUser(id, userData) {
        try {
            if (configService.isDevelopment()) {
                console.log(`👤 Atualizando usuário ${id}...`)
            }

            const response = await api.put(`/auth/user/${id}`, userData)

            const updatedUser = response.data?.data ?? response.data

            if (configService.isDevelopment()) {
                console.log('✅ Usuário atualizado com sucesso')
            }

            return { success: true, data: updatedUser }
        } catch (error) {
            console.error('❌ Erro ao atualizar usuário:', error.response?.data || error.message)
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao atualizar usuário'
            }
        }
    },

    async deleteUser(id) {
        try {
            if (configService.isDevelopment()) {
                console.log(`🗑️ Deletando usuário ${id}...`)
            }

            await api.delete(`/auth/user/${id}`)

            if (configService.isDevelopment()) {
                console.log('✅ Usuário deletado com sucesso')
            }

            return { success: true }
        } catch (error) {
            console.error('❌ Erro ao deletar usuário:', error.response?.data || error.message)
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao deletar usuário'
            }
        }
    },

    async searchUsers(searchTerm, params = {}) {
        try {
            if (configService.isDevelopment()) {
                console.log('🔍 Pesquisando usuários:', searchTerm)
            }

            // Busca local a partir da lista completa da API
            const usersResult = await this.getUsers(params)

            if (!usersResult.success) {
                throw new Error(usersResult.message)
            }

            const allUsers = usersResult.data
            const searchLower = searchTerm.toLowerCase()

            const filteredUsers = allUsers.filter(user =>
                user.name?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower)
            )

            if (configService.isDevelopment()) {
                console.log('✅ Pesquisa concluída:', filteredUsers.length, 'resultados')
            }

            return { success: true, data: filteredUsers }
        } catch (error) {
            console.error('❌ Erro na pesquisa:', error.response?.data || error.message)
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao pesquisar usuários'
            }
        }
    },

}