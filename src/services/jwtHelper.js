import Cookies from 'js-cookie'
import { configService } from './config.js'

/**
 * Utilitários para trabalhar com tokens JWT
 */
export const jwtHelper = {
    /**
     * Obtém o token atual do cookie
     */
    getToken() {
        return Cookies.get('auth_token')
    },

    /**
     * Verifica se existe um token válido
     */
    hasToken() {
        return !!this.getToken()
    },

    /**
     * Decodifica o payload do JWT (sem verificar assinatura)
     * Usado apenas para obter informações básicas como ID do usuário
     */
    decodePayload() {
        const token = this.getToken()
        if (!token) return null

        try {
            // JWT tem formato: header.payload.signature
            const parts = token.split('.')
            if (parts.length !== 3) {
                console.warn('⚠️ Token JWT inválido - formato incorreto')
                return null
            }

            // Decodificar o payload (parte do meio)
            const payload = parts[1]
            
            // Adicionar padding se necessário para Base64
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
            
            // Decodificar Base64
            const decodedPayload = atob(paddedPayload)
            
            // Parse JSON
            const parsedPayload = JSON.parse(decodedPayload)
            
            if (configService.isDevelopment()) {
                console.log('🔓 JWT payload decodificado:', parsedPayload)
            }
            
            return parsedPayload
        } catch (error) {
            console.error('❌ Erro ao decodificar token JWT:', error)
            return null
        }
    },

    /**
     * Obtém o ID do usuário a partir do token JWT
     */
    getCurrentUserId() {
        const payload = this.decodePayload()
        return payload?.userId || payload?.sub || payload?.id || null
    },

    /**
     * Obtém informações básicas do usuário a partir do token
     */
    getCurrentUserInfo() {
        const payload = this.decodePayload()
        if (!payload) return null

        return {
            id: payload.userId || payload.sub || payload.id,
            email: payload.email,
            name: payload.name,
            role: payload.role,
            exp: payload.exp, // Data de expiração
            iat: payload.iat  // Data de emissão
        }
    },

    /**
     * Verifica se o token está expirado
     */
    isTokenExpired() {
        const payload = this.decodePayload()
        if (!payload || !payload.exp) return true

        // exp está em segundos, Date.now() está em milissegundos
        const currentTime = Math.floor(Date.now() / 1000)
        const isExpired = payload.exp < currentTime

        if (isExpired && configService.isDevelopment()) {
            console.warn('⏰ Token JWT expirado:', {
                expiration: new Date(payload.exp * 1000).toISOString(),
                current: new Date(currentTime * 1000).toISOString()
            })
        }

        return isExpired
    },

    /**
     * Obtém o tempo restante do token em segundos
     */
    getTokenTimeRemaining() {
        const payload = this.decodePayload()
        if (!payload || !payload.exp) return 0

        const currentTime = Math.floor(Date.now() / 1000)
        const timeRemaining = payload.exp - currentTime

        return Math.max(0, timeRemaining)
    },

    /**
     * Formata o tempo restante do token em formato legível
     */
    getTokenTimeRemainingFormatted() {
        const seconds = this.getTokenTimeRemaining()
        
        if (seconds <= 0) return 'Expirado'
        
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60

        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`
        } else {
            return `${remainingSeconds}s`
        }
    },

    /**
     * Remove o token (usado no logout)
     */
    removeToken() {
        Cookies.remove('auth_token')
        
        if (configService.isDevelopment()) {
            console.log('🔓 Token JWT removido')
        }
    },

    /**
     * Informações de debug sobre o token atual
     */
    getDebugInfo() {
        if (!configService.isDevelopment()) return null

        const token = this.getToken()
        const payload = this.decodePayload()
        
        return {
            hasToken: this.hasToken(),
            isExpired: this.isTokenExpired(),
            timeRemaining: this.getTokenTimeRemainingFormatted(),
            userId: this.getCurrentUserId(),
            userInfo: this.getCurrentUserInfo(),
            tokenLength: token?.length || 0,
            payload: payload
        }
    },

    /**
     * Log informações de debug do token
     */
    logDebugInfo() {
        if (configService.isDevelopment()) {
            const debugInfo = this.getDebugInfo()
            console.group('🔐 JWT Debug Info')
            console.table(debugInfo)
            console.groupEnd()
        }
    }
}