<template>
  <div class="min-h-screen bg-gradient-to-br flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-6 shadow-none sm:shadow-md rounded-2xl sm:px-10 text-center">
        <!-- Back button -->
        <RouterLink
          to="/login"
          class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft class="h-4 w-4 mr-1" />
          Back to login
        </RouterLink>

        <!-- Header -->
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Forgot your password?</h2>
          <p class="text-gray-600 mb-8">
            {{ isSubmitted
              ? "Check your email for a password reset link"
              : "Enter your email to reset your password" }}
          </p>
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center animate-fade-in"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          {{ successMessage }}
        </div>

        <!-- Backend Error -->
        <div
          v-if="backendError"
          class="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center animate-fade-in"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          {{ backendError }}
        </div>

        <!-- Form -->
        <form v-if="!isSubmitted" @submit.prevent="handleSubmit" class="space-y-6" novalidate>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 text-left mb-1">
              Email address
            </label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="block w-full pl-10 pr-3 py-2 border"
                :class="errors.email ? 'border-red-300' : 'border-gray-300'"
                placeholder="you@example.com"
              />
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="isSubmitting ? 'opacity-70 cursor-not-allowed' : ''"
            >
              {{ isSubmitting ? "Sending..." : "Send reset link" }}
            </button>
          </div>
        </form>

        <!-- Submitted Message -->
        <div v-else class="text-center py-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <Mail class="h-8 w-8 text-green-600" />
          </div>
          <p class="text-gray-600 mb-6">
            We've sent instructions to <span class="font-medium">{{ email }}</span>.
            Please check your inbox.
          </p>
          <p class="text-sm text-gray-500">
            Didn't receive the email?
            <button
              @click="resetState"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, ArrowLeft } from 'lucide-vue-next'
import api from '../../utils/api'

const email = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errors = ref({})
const backendError = ref('')
const successMessage = ref('')
const router = useRouter()

const validateEmail = (emailValue) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(emailValue).toLowerCase())
}

const handleSubmit = async () => {
  errors.value = {}
  backendError.value = ''
  successMessage.value = ''

  if (!email.value.trim()) {
    errors.value.email = 'Email is required'
    return
  }

  if (!validateEmail(email.value)) {
    errors.value.email = 'Enter a valid email address'
    return
  }

  isSubmitting.value = true

  try {
    // Simulated request (replace with real API)
    const res = await api.post('/user/forgot-password', { email: email.value })

    successMessage.value = res.data.message || 'Reset link sent to your email'
    isSubmitted.value = true
  } catch (err) {
    backendError.value = err.response?.data?.message || 'Something went wrong'
  } finally {
    isSubmitting.value = false
  }
}

const resetState = () => {
  isSubmitted.value = false
  successMessage.value = ''
  backendError.value = ''
  errors.value = {}
}

onUnmounted(() => {
  resetState()
})
</script>
