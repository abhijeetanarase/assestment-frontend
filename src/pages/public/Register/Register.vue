<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-2 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="transition-opacity duration-300">
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">Join our community</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Sign in
          </router-link>
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md transition-all duration-300">
      <div class="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-gray-100">
        
        <!-- Success -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center animate-fade-in">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          {{ successMessage }}
        </div>

        <!-- Error -->
        <div v-if="backendError" class="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center animate-fade-in">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          {{ backendError }}
        </div>

        <!-- Google Sign-In -->
        <div class="mt-6 space-y-4">
          <button
            type="button"
            @click="handleGoogleSignIn"
            class="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 active:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              class="w-5 h-5"
            />
            <span class="text-sm font-medium text-gray-700">Continue with Google</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="mt-6 relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or register with email</span>
          </div>
        </div>

        <!-- Registration Form -->
        <form class="space-y-5 mt-6" novalidate @submit.prevent="submitForm">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div class="relative rounded-md shadow-sm">
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="John Doe"
                class="block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                :class="errors.name ? 'border-red-300' : 'border-gray-300'"
              />
              <User class="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400" />
            </div>
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <div class="relative rounded-md shadow-sm">
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                class="block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                :class="errors.email ? 'border-red-300' : 'border-gray-300'"
              />
              <Mail class="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400" />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative rounded-md shadow-sm">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="block w-full pl-10 pr-10 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                :class="errors.password ? 'border-red-300' : 'border-gray-300'"
              />
              <Lock class="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400" />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                @click="togglePassword"
              >
                <component :is="showPassword ? EyeOff : Eye" class="h-5 w-5" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Submit -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSubmitting || !form.name || !form.email || !form.password"
              class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              :class="isSubmitting || !form.name || !form.email || !form.password ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-md hover:bg-blue-700'"
            >
              <template v-if="isSubmitting">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </template>
              <template v-else>
                Register
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-vue-next";
import api from "../../../utils/api";
import { baseUrl } from "../../../utils/constants";

// Local state
const form = ref({ name: "", email: "", password: "" });
const showPassword = ref(false);
const errors = ref({});
const backendError = ref("");
const successMessage = ref("");
const isSubmitting = ref(false);

const router = useRouter();

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function validate() {
  const newErrors = {};

  // Name validation
  const name = form.value.name.trim();
  if (!name) {
    newErrors.name = "Name is required.";
  } else if (name.length < 3) {
    newErrors.name = "Name must be at least 3 characters.";
  } else if (name.length > 50) {
    newErrors.name = "Name must be less than 50 characters.";
  }

  // Email validation (basic pattern)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const email = form.value.email.trim();
  if (!email) {
    newErrors.email = "Email is required.";
  } else if (!emailPattern.test(email)) {
    newErrors.email = "Please enter a valid email address.";
  }

  // Password validation
  const password = form.value.password;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!password) {
    newErrors.password = "Password is required.";
  } else if (password.length < 8) {
    newErrors.password = "Password must be at least 8 characters.";
  } else if (!passwordPattern.test(password)) {
    newErrors.password =
      "Password must include uppercase, lowercase, number, and special character.";
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}


async function  submitForm() {
  if (!validate()) return;
  isSubmitting.value = true;
  backendError.value = "";
  successMessage.value = "";
  try {
    const res = await api.post("/user/register", {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
    });
    isSubmitting.value = false;
    successMessage.value = res.data.message || "Registration successful!";
    form.value = { name: "", email: "", password: "" }; // Reset form
   
    
  } catch (error) {
    console.log("Registration Failed",error);
    
    isSubmitting.value = false;
    backendError.value = error.response?.data?.message || "Registration failed. Please try again.";
    
  }finally {
    isSubmitting.value = false;
  }
}

function handleGoogleSignIn() {
  window.location.href = `${baseUrl}/user/google`;
}

onUnmounted(() => {
  errors.value = {};
  backendError.value = "";
});
</script>
