/**
 * Serviço de configuração centralizado para variáveis de ambiente Vite
 * Fornece acesso seguro e tipado às configurações da aplicação
 */

class ConfigService {
  constructor() {
    this.config = this.loadConfig()
    this.validateConfig()
  }

  /**
   * Carrega configurações das variáveis de ambiente Vite
   */
  loadConfig() {
    return {
      // API Configuration
      API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      
      // App Configuration
      APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Dashboard Admin',
      APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
      ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
      
      // Build Information (sempre disponível no Vite)
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
      
      // Base URL da aplicação
      BASE_URL: import.meta.env.BASE_URL || '/'
    }
  }

  /**
   * Valida se as configurações obrigatórias estão presentes
   */
  validateConfig() {
    const requiredConfigs = ['API_URL', 'APP_TITLE']
    
    const missingConfigs = requiredConfigs.filter(key => !this.config[key])
    
    if (missingConfigs.length > 0) {
      console.warn('⚠️ Configurações obrigatórias não encontradas:', missingConfigs)
    }

    // Log de configurações carregadas (apenas em desenvolvimento)
    if (this.isDevelopment()) {
      console.log('🔧 Configurações carregadas:', {
        API_URL: this.config.API_URL,
        APP_TITLE: this.config.APP_TITLE,
        ENVIRONMENT: this.config.ENVIRONMENT,
        MODE: this.config.MODE
      })
    }
  }

  /**
   * Obtém uma configuração específica
   */
  get(key) {
    return this.config[key]
  }

  /**
   * Obtém todas as configurações
   */
  getAll() {
    return { ...this.config }
  }

  // === API Configuration ===
  getApiUrl() {
    return this.config.API_URL
  }

  getApiTimeout() {
    return 10000 // 10 segundos
  }

  // === App Configuration ===
  getAppTitle() {
    return this.config.APP_TITLE
  }

  getAppVersion() {
    return this.config.APP_VERSION
  }

  getBaseUrl() {
    return this.config.BASE_URL
  }

  // === Environment Checks ===
  getEnvironment() {
    return this.config.ENVIRONMENT
  }

  isDevelopment() {
    return this.config.DEV || this.config.ENVIRONMENT === 'development'
  }

  isProduction() {
    return this.config.PROD || this.config.ENVIRONMENT === 'production'
  }

  isStaging() {
    return this.config.ENVIRONMENT === 'staging'
  }

  // === Cookie Configuration ===
  getCookieConfig() {
    return {
      // Token expira em 30 minutos em produção, 1 dia em desenvolvimento
      tokenExpiry: this.isProduction() ? 30/1440 : 1, // dias
      secure: this.isProduction(), // HTTPS apenas em produção
      sameSite: 'lax'
    }
  }

  // === Debug Information ===
  getDebugInfo() {
    return {
      config: this.getAll(),
      buildTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
  }

  /**
   * Imprime informações de debug no console
   */
  logDebugInfo() {
    if (this.isDevelopment()) {
      console.group('🔧 Debug Info - ConfigService')
      console.table(this.getDebugInfo().config)
      console.log('🌐 Current URL:', window.location.href)
      console.log('🕒 Build Time:', this.getDebugInfo().buildTime)
      console.groupEnd()
    }
  }
}

// Instância singleton
export const configService = new ConfigService()

// Log inicial em desenvolvimento
if (configService.isDevelopment()) {
  configService.logDebugInfo()
}

export default configService