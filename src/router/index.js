import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: { requiresGuest: true }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/RegisterView.vue'),
            meta: { requiresGuest: true }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('@/views/DashboardView.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

// Guard de autenticação
router.beforeEach((to) => {
    const authStore = useAuthStore()
    authStore.checkAuth()

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        return '/login'
    }

    if (to.meta.requiresGuest && authStore.isLoggedIn) {
        return '/dashboard'
    }
})

export default router
