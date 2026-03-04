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
     * Lista todos os usuários (simulada por enquanto - adaptada para API real)
     * Nota: A API atual só tem endpoint /auth/user/{id}, então simularemos uma lista
     */
    async getUsers(params = {}) {
        try {
            if (configService.isDevelopment()) {
                console.log('👥 Simulando lista de usuários (API limitada)...', params)
            }
            
            // Por enquanto, vamos retornar uma lista simulada baseada no usuário atual
            // Em uma API real, teria um endpoint /users ou /auth/users
            const currentUserResult = await this.getCurrentUser()
            
            if (!currentUserResult.success) {
                throw new Error(currentUserResult.message)
            }

            // Lista simulada baseada no usuário atual
            const simulatedUsers = [
                {
                    ...currentUserResult.data,
                    id: currentUserResult.data.id || 1,
                    status: 'active',
                    role: currentUserResult.data.role || 'user',
                    createdAt: new Date().toISOString()
                }
            ]

            // Adicionar alguns usuários fictícios para demonstração
            for (let i = 2; i <= 10; i++) {
                simulatedUsers.push({
                    id: i,
                    name: `Usuário Exemplo ${i}`,
                    email: `user${i}@example.com`,
                    role: i <= 2 ? 'admin' : i <= 4 ? 'manager' : 'user',
                    status: i % 7 === 0 ? 'inactive' : 'active',
                    phone: `(11) 9999-${String(i).padStart(4, '0')}`,
                    department: i <= 3 ? 'TI' : i <= 6 ? 'Vendas' : 'Marketing',
                    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
                })
            }
            
            if (configService.isDevelopment()) {
                console.log('✅ Lista simulada de usuários criada:', simulatedUsers.length, 'usuários')
                console.warn('⚠️ Nota: Esta é uma lista simulada. Implemente /users na API para dados reais.')
            }
            
            return { success: true, data: simulatedUsers }
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
                console.log(`👤 Tentando atualizar usuário ${id}...`)
                console.warn('⚠️ API atual não tem endpoint PUT /users/{id}. Implementação simulada.')
            }
            
            // Como a API atual não tem endpoint de atualização, simular sucesso
            // Em uma API real, seria: await api.put(`/users/${id}`, userData)
            
            // Simular delay de rede
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const updatedUser = {
                id: id,
                ...userData,
                updatedAt: new Date().toISOString()
            }
            
            if (configService.isDevelopment()) {
                console.log('✅ Usuário atualizado (simulado):', updatedUser)
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
                console.log(`🗑️ Tentando deletar usuário ${id}...`)
                console.warn('⚠️ API atual não tem endpoint DELETE /users/{id}. Implementação simulada.')
            }
            
            // Como a API atual não tem endpoint de deleção, simular sucesso
            // Em uma API real, seria: await api.delete(`/users/${id}`)
            
            // Simular delay de rede
            await new Promise(resolve => setTimeout(resolve, 300))
            
            if (configService.isDevelopment()) {
                console.log('✅ Usuário deletado (simulado)')
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
                console.warn('⚠️ API atual não tem endpoint de pesquisa. Simulando busca local.')
            }
            
            // Como não temos endpoint de pesquisa, simular busca na lista atual
            const usersResult = await this.getUsers(params)
            
            if (!usersResult.success) {
                throw new Error(usersResult.message)
            }

            const allUsers = usersResult.data
            const searchLower = searchTerm.toLowerCase()
            
            const filteredUsers = allUsers.filter(user => 
                user.name?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower) ||
                user.department?.toLowerCase().includes(searchLower)
            )
            
            if (configService.isDevelopment()) {
                console.log('✅ Pesquisa simulada concluída:', filteredUsers.length, 'resultados')
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

    /**
     * Informações sobre a limitação atual da API
     */
    getApiLimitations() {
        return {
            hasRealUsersCrud: false,
            availableEndpoints: [
                'POST /auth/register - Criar usuário',
                'GET /auth/user/{id} - Buscar usuário específico',
                'POST /auth/login - Autenticação'
            ],
            missingEndpoints: [
                'GET /users - Listar usuários',
                'PUT /users/{id} - Atualizar usuário',
                'DELETE /users/{id} - Deletar usuário',
                'GET /users/search - Pesquisar usuários'
            ],
            simulatedOperations: [
                'Lista de usuários (baseada no usuário atual + dados fictícios)',
                'Atualização de usuários (simulada localmente)',
                'Deleção de usuários (simulada localmente)',
                'Pesquisa de usuários (filtro local)'
            ],
            recommendations: [
                'Implementar endpoints completos de CRUD no backend',
                'Adicionar endpoint GET /users para listagem',
                'Adicionar endpoint PUT /users/{id} para atualização',
                'Adicionar endpoint DELETE /users/{id} para deleção',
                'Adicionar paginação e filtros na API'
            ]
        }
    },

    /**
     * Log das limitações da API (apenas em desenvolvimento)
     */
    logApiLimitations() {
        if (configService.isDevelopment()) {
            const limitations = this.getApiLimitations()
            console.group('⚠️ Limitações da API Atual')
            console.log('📍 Endpoints disponíveis:', limitations.availableEndpoints)
            console.log('❌ Endpoints em falta:', limitations.missingEndpoints)
            console.log('🔧 Operações simuladas:', limitations.simulatedOperations)
            console.log('💡 Recomendações:', limitations.recommendations)
            console.groupEnd()
        }
    }
}