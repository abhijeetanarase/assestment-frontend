import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import UserLayout from '../layouts/UserLayout.vue'
import PubicLayout from '../layouts/PubicLayout.vue'
import DashBoard from '../pages/admin/Dashboard/DashBoard.vue'
import Products from '../pages/admin/Products/Products.vue'
import Settings from '../pages/admin/Settings/Settings.vue'
import AdminUsers from '../pages/admin/Users/AdminUsers.vue'
import UserDashboard from '../pages/user/Dashboard/Dashboard.vue'
import Profile from '../pages/user/Profile/Profile.vue'
import UserSettings from '../pages/user/Settings/Settings.vue'
import Register from '../pages/public/Register/Register.vue'
import EditProduct from '../pages/admin/Products/EditProduct.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: PubicLayout,
      children: [
        {
          path: '',
          name: 'register',
          component: Register,

        },
        {
            path: 'login',
            name: 'login',
            component: () => import('../pages/public/Login/Login.vue')
        },
         {
            path: 'reset-password/:token',
            name: 'reset-password',
            component: () => import('../pages/public/ResetPassword.vue')
        },
         {
            path: 'forgot-password',
            name: 'forgot-password',
            component: () => import('../pages/public/ForgotPassword.vue')
        },
         {
            path : 'success',
            name: 'success',
            component: () => import('../pages/public/UserProfileSuccessPage.vue')
         },
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component:  DashBoard
        },
        {
          path: 'users',
          name: 'admin-users',
          component: AdminUsers
        },
        {
          path: 'products',
          name: 'admin-products',
          component: Products
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: Settings
        },{
            path : 'products/add-product',
            name: 'add-product',
            component: () => import('../pages/admin/Products/AddProduct.vue')
        },
        {
            path : 'products/edit-product/:id',
            name : "edit-product",
            component : EditProduct
        }
      ]
    },
    {
      path: '/user',
      component: UserLayout,
      meta: { requiresAuth: true, role: 'user' },
      children: [
        {
          path: 'home',
          name: 'user-home',
          component: UserDashboard
        },
        {
          path: 'profile',
          name: 'user-profile',
          component: Profile
        },
        {
          path: 'settings',
          name: 'user-settings',
          component: UserSettings
        },
        {
            path : "search",
            name: 'search',
            component: () => import('../pages/user/ProductFilter.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken') // Set to false to simulate unauthenticated
  const userRole = localStorage.getItem('role') // Change to 'user' to test user routes
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else if (to.meta.role && to.meta.role !== userRole) {
      next('/') // Redirect to home if role doesn't match
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router