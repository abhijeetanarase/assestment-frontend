<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-2 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Login to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        New User?
        <router-link to="/" class="font-medium text-blue-600 hover:text-blue-500">
          Sign up
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center animate-fade-in">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          {{ successMessage }}
        </div>

        <div v-if="backendError" class="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center animate-fade-in">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          {{ backendError }}
        </div>

        <div class="mt-6 gap-3">
          <button @click="handleGoogleSignIn" type="button" class="w-full flex cursor-pointer items-center mt-4 justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5" />
            <span class="text-sm font-medium text-gray-700">
              Continue with Google
            </span>
          </button>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>
        </div>

        <form class="space-y-6 mt-6" @submit.prevent="submit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input id="email" v-model="email" name="email" type="email" autocomplete="email" class="block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" :class="errors.email ? 'border-red-300' : 'border-gray-300'" placeholder="you@example.com" />
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input id="password" v-model="password" name="password" :type="showPassword ? 'text' : 'password'" class="block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" :class="errors.password ? 'border-red-300' : 'border-gray-300'" placeholder="••••••••" />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" class="text-gray-400 hover:text-gray-500 focus:outline-none" @click="togglePassword">
                  <Eye v-if="!showPassword" class="h-5 w-5" />
                  <EyeOff v-else class="h-5 w-5" />
                </button>
              </div>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <div>
            <button type="submit" :disabled="isSubmitting || !email || !password" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" :class="isSubmitting || !email || !password ? 'opacity-70 cursor-not-allowed' : ''">
              <span v-if="isSubmitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
              <span v-else>Login</span>
            </button>
            <div class="flex justify-end mt-2">
              <router-link to="/forgot-password" class="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Forgot Password?
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, Mail, Eye, EyeOff } from 'lucide-vue-next'
import api from "../../../utils/api"
import { baseUrl } from '../../../utils/constants'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const errors = ref({})
const backendError = ref('')
const successMessage = ref('')
const token = ref('')

const router = useRouter()

const submit = async () => {
  errors.value = {}
  backendError.value = ''
  successMessage.value = ''
  isSubmitting.value = true

  // Simple validation
  if (!email.value) errors.value.email = 'Email is required'
  if (!password.value) errors.value.password = 'Password is required'

  if (Object.keys(errors.value).length > 0) {
    isSubmitting.value = false
    return
  }

  try {
    const res = await api.post("/user/login", {
      email: email.value,
      password: password.value
    })
    if (res.data && res.data.token) {
      token.value = res.data.token
      successMessage.value = 'Login successful! Redirecting...'
      localStorage.setItem("authToken", `Bearer ${res.data.token}`)
      localStorage.setItem("name", res.data.user.name)
      localStorage.setItem("email", res.data.user.email)
      localStorage.setItem("role", res.data.user.role)
      localStorage.setItem("avatar", res.data.user.picture || '')
      localStorage.setItem("userId", res.data.user.id)
    } else {
      backendError.value = 'Login failed. Please try again.'
    }
  } catch (error) {
    backendError.value = error.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    isSubmitting.value = false
    if (token.value) {
      router.push('/success')
    }
  }
}

const handleGoogleSignIn = () => {
  window.location.href = `${baseUrl}/user/google`
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

watch(token, (newToken) => {
  if (newToken) router.push('/success')
})

onUnmounted(() => {
  errors.value = {}
  backendError.value = ''
  successMessage.value = ''
  token.value = ''
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>