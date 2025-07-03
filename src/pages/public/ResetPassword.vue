<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 text-center">
        <template v-if="isSuccess">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <Key class="h-8 w-8 text-green-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
          <p class="text-gray-600 mb-6">Your password has been successfully reset.</p>
          <button
            @click="router.push('/login')"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Login
          </button>
        </template>

        <template v-else>
          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Reset Password</h2>
          <p class="text-gray-600 mb-8">Enter your new password below</p>

          <div v-if="error" class="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-md">
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 text-left mb-1">
                New Password
              </label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  minlength="8"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 text-left mb-1">
                Confirm Password
              </label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  required
                  minlength="8"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                :class="isLoading ? 'opacity-70 cursor-not-allowed' : ''"
              >
                {{ isLoading ? 'Updating...' : 'Reset Password' }}
              </button>
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Lock, Key } from 'lucide-vue-next'
import api from '../../utils/api' // Replace with correct path

const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)

const token = route.params.token

const handleSubmit = async () => {
  const trimmedPassword = password.value.trim();
  const trimmedConfirmPassword = confirmPassword.value.trim();

  if (trimmedPassword.length < 8) {
    error.value = "Password must be at least 8 characters long";
    return;
  }

  if (trimmedPassword !== trimmedConfirmPassword) {
    error.value = "Passwords don't match";
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    await api.post('/user/reset-password', {
      slug: token,
      newPassword: trimmedPassword
    });
    isSuccess.value = true;
  } catch (err) {
    error.value = err.response?.data?.message || 'Password reset failed';
  } finally {
    isLoading.value = false;
  }
};

</script>
