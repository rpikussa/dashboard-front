import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

// Mock router para o teste
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>Home Page</div>' }
    }
  ]
})

describe('App', () => {
  it('mounts renders properly', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    
    // Verifica se o componente App renderiza corretamente
    expect(wrapper.find('#app').exists()).toBe(true)
    expect(wrapper.find('#app').attributes('id')).toBe('app')
  })

  it('has correct structure', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    
    // Verifica a estrutura básica
    const appDiv = wrapper.find('#app')
    expect(appDiv.exists()).toBe(true)
    
    // Verifica se é um componente Vue válido
    expect(wrapper.vm).toBeDefined()
  })
})
