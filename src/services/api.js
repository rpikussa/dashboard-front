import axios from 'axios'
import Cookies from 'js-cookie'
import { configService } from './config.js'

const api = axios.create({
    baseURL: configService.getApiUrl(),
    timeout: configService.getApiTimeout(),
    headers: {
        'Content-Type': 'application/json'
    }
})

// Log da configuração da API em desenvolvimento
if (configService.isDevelopment()) {
    console.log('🔗 API configurada:', {
        baseURL: configService.getApiUrl(),
        timeout: configService.getApiTimeout(),
        environment: configService.getEnvironment()
    })
}

// Interceptor para adicionar token
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        
        // Log das requisições em desenvolvimento
        if (configService.isDevelopment()) {
            console.log('📤 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                baseURL: config.baseURL,
                hasToken: !!token
            })
        }
        
        return config
    },
    (error) => {
        console.error('❌ Request Error:', error)
        return Promise.reject(error)
    }
)

// Interceptor para tratar respostas
api.interceptors.response.use(
    (response) => {
        // Log das respostas em desenvolvimento
        if (configService.isDevelopment()) {
            console.log('📥 API Response:', {
                status: response.status,
                url: response.config.url,
                method: response.config.method?.toUpperCase()
            })
        }
        return response
    },
    (error) => {
        console.error('❌ API Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            url: error.config?.url
        })
        
        if (error.response?.status === 401) {
            console.warn('🔒 Token expirado ou inválido, redirecionando para login...')
            Cookies.remove('auth_token')
            window.location.href = '/login'
        }
        
        return Promise.reject(error)
    }
)

export default api