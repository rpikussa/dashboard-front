import { defineStore } from 'pinia'
import { userService } from '@/services/userService.js'
import { configService } from '@/services/config.js'

export const useUserStore = defineStore('users', {
    state: () => ({
        users: [],
        currentUser: null,
        loading: false,
        searchLoading: false,
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        },
        searchTerm: '',
        filters: {}
    }),

    getters: {
        getUserById: (state) => (id) => {
            return state.users.find(user => user.id === id)
        },
        
        filteredUsers: (state) => {
            if (!state.searchTerm) return state.users
            
            const term = state.searchTerm.toLowerCase()
            return state.users.filter(user => 
                user.name?.toLowerCase().includes(term) ||
                user.email?.toLowerCase().includes(term)
            )
        },

        hasUsers: (state) => state.users.length > 0,
        
        totalPages: (state) => Math.ceil(state.pagination.total / state.pagination.pageSize)
    },

    actions: {
        async fetchUsers(params = {}) {
            this.loading = true
            try {
                if (configService.isDevelopment()) {
                    console.log('🏪 Store: Carregando usuários...', params)
                }

                const result = await userService.getUsers({
                    page: this.pagination.current,
                    limit: this.pagination.pageSize,
                    ...params
                })

                if (result.success) {
                    this.users = result.data.users || result.data
                    
                    // Se a API retorna informações de paginação
                    if (result.data.pagination) {
                        this.pagination.total = result.data.pagination.total
                        this.pagination.current = result.data.pagination.page
                    } else if (Array.isArray(result.data)) {
                        // Se retorna apenas array, assumir total como length
                        this.pagination.total = result.data.length
                    }

                    if (configService.isDevelopment()) {
                        console.log('✅ Store: Usuários carregados:', this.users.length)
                    }
                }

                return result
            } finally {
                this.loading = false
            }
        },

        async fetchUser(id) {
            this.loading = true
            try {
                if (configService.isDevelopment()) {
                    console.log('🏪 Store: Carregando usuário:', id)
                }

                const result = await userService.getUser(id)

                if (result.success) {
                    this.currentUser = result.data
                    
                    // Atualizar na lista se existir
                    const index = this.users.findIndex(u => u.id === id)
                    if (index !== -1) {
                        this.users[index] = result.data
                    }
                }

                return result
            } finally {
                this.loading = false
            }
        },

        async createUser(userData) {
            this.loading = true
            try {
                if (configService.isDevelopment()) {
                    console.log('🏪 Store: Criando usuário...', userData.email)
                }

                const result = await userService.createUser(userData)

                if (result.success) {
                    // Adicionar à lista local
                    this.users.unshift(result.data)
                    this.pagination.total += 1
                    
                    if (configService.isDevelopment()) {
                        console.log('✅ Store: Usuário criado e adicionado à lista')
                    }
                }

                return result
            } finally {
                this.loading = false
            }
        },

        async updateUser(id, userData) {
            this.loading = true
            try {
                if (configService.isDevelopment()) {
                    console.log('🏪 Store: Atualizando usuário:', id)
                }

                const result = await userService.updateUser(id, userData)

                if (result.success) {
                    // Atualizar na lista local
                    const index = this.users.findIndex(u => u.id === id)
                    if (index !== -1) {
                        this.users[index] = { ...this.users[index], ...result.data }
                    }
                    
                    // Atualizar currentUser se for o mesmo
                    if (this.currentUser?.id === id) {
                        this.currentUser = { ...this.currentUser, ...result.data }
                    }
                    
                    if (configService.isDevelopment()) {
                        console.log('✅ Store: Usuário atualizado na lista')
                    }
                }

                return result
            } finally {
                this.loading = false
            }
        },

        async deleteUser(id) {
            this.loading = true
            try {
                if (configService.isDevelopment()) {
                    console.log('🏪 Store: Deletando usuário:', id)
                }

                const result = await userService.deleteUser(id)

                if (result.success) {
                    // Remover da lista local
                    const index = this.users.findIndex(u => u.id === id)
                    if (index !== -1) {
                        this.users.splice(index, 1)
                        this.pagination.total -= 1
                    }
                    
                    // Limpar currentUser se for o mesmo
                    if (this.currentUser?.id === id) {
                        this.currentUser = null
                    }
                    
                    if (configService.isDevelopment()) {
                        console.log('✅ Store: Usuário removido da lista')
                    }
                }

                return result
            } finally {
                this.loading = false
            }
        },

        async searchUsers(searchTerm) {
            this.searchLoading = true
            this.searchTerm = searchTerm
            
            try {
                if (configService.isDevelopment()) {
                    console.log('🏪 Store: Pesquisando usuários:', searchTerm)
                }

                if (!searchTerm.trim()) {
                    // Se pesquisa vazia, recarregar lista completa
                    return await this.fetchUsers()
                }

                const result = await userService.searchUsers(searchTerm, {
                    page: this.pagination.current,
                    limit: this.pagination.pageSize
                })

                if (result.success) {
                    this.users = result.data.users || result.data
                    
                    if (result.data.pagination) {
                        this.pagination.total = result.data.pagination.total
                    }
                }

                return result
            } finally {
                this.searchLoading = false
            }
        },

        // Ações para paginação
        setPage(page) {
            this.pagination.current = page
            if (this.searchTerm) {
                return this.searchUsers(this.searchTerm)
            } else {
                return this.fetchUsers()
            }
        },

        setPageSize(size) {
            this.pagination.pageSize = size
            this.pagination.current = 1
            if (this.searchTerm) {
                return this.searchUsers(this.searchTerm)
            } else {
                return this.fetchUsers()
            }
        },

        // Limpar dados
        clearSearch() {
            this.searchTerm = ''
            this.pagination.current = 1
            return this.fetchUsers()
        },

        clearCurrentUser() {
            this.currentUser = null
        }
    }
})