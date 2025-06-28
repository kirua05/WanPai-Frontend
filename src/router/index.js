import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/utils/toast'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
    },

    {
      path: '/products',
      name: 'productList',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/products',
      name: 'productList',
      component: () => import('../views/ProductListPage.vue'),
    },
    {
      path: '/products/:id',
      name: 'productDetail',
      component: () => import('../views/ProductDetailPage.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin/AdminHome.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: 'products',
          name: 'products',
          component: () => import('../views/Admin/AdminProducts.vue'),
        },
        {
          path: 'products/create',
          name: 'createProduct',
          component: () => import('../views/Admin/EditProduct.vue'),
        },
        {
          path: 'products/edit/:id',
          name: 'editProduct',
          component: () => import('@/views/Admin/EditProduct.vue'),
        },

        {
          path: 'orders',
          name: 'orders',
          component: () => import('../views/Admin/AdminOrders.vue'),
        },
        {
          path: 'orders/edit/:id',
          name: 'editOrder',
          component: () => import('../views/Admin/EditOrder.vue'),
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('../views/Admin/AdminInventory.vue'),
        },
        {
          path: 'products/:id/stock-logs',
          name: 'stockLog',
          component: () => import('../views/Admin/stockLog.vue'),
        },
      ],
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('@/views/OrderManagement.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/authform',
      name: 'authform',
      component: () => import('@/views/AuthForm.vue'),
    },
    {
      path: '/orderdetail/:id',
      name: 'orderDetail',
      component: () => import('@/views/OrderDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('@/views/FavoritePage.vue'),
    },
    {
      path: '/userprofile',
      name: 'userprofile',
      component: () => import('@/views/UserProfile.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    showToast({
      severity: 'warn',
      summary: '需要登入',
      detail: '請先登入才能訪問此頁面',
    })
    next('/authform')
    return
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    showToast({
      severity: 'error',
      summary: '權限不足',
      detail: '需要管理員權限才能訪問此頁面',
    })

    next('/')
    return
  }

  next()
})

export default router
