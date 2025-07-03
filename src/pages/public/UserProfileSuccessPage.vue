<template>
  <div class="min-h-screen bg-gradient-to-br flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 text-center">
        <!-- Success Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircle2 class="h-10 w-10 text-green-600" />
        </div>

        <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
          Welcome {{ user.name }}!
        </h2>
        <p class="text-gray-600 mb-8">
          Your account has been successfully authenticated
        </p>

        <!-- Countdown notice -->
        <p class="text-sm text-gray-500 mb-6">
          Redirecting in {{ countdown }} second<span v-if="countdown !== 1">s</span>...
        </p>

        <!-- User Profile Card -->
        <div class="mt-6 border-t border-gray-200 pt-6">
          <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="relative group">
                <div class="relative">
                  <img
                    class="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md cursor-pointer"
                    :src="user.avatar"
                    :alt="user.name"
                  />
                </div>
              </div>
              <div class="ml-4 text-left">
                <p class="text-lg font-semibold text-gray-900">
                  {{ user.name }}
                </p>
                <p class="text-sm text-gray-600 flex items-center">
                  <Mail class="mr-2 h-4 w-4" />
                  {{ user.email }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="mt-8">
          <button
            @click="goToMailbox"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-md font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:-translate-y-0.5"
          >
            Continue
            <ArrowRight class="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { CheckCircle2, Mail, ArrowRight } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const countdown = ref(5);
const user = ref({ name: '', email: '', avatar: '' });

const params = route.query;

onMounted(() => {
  const token = params.token || localStorage.getItem("authToken");
  const nameParam = params.name || localStorage.getItem("name");
  const emailParam = params.email || localStorage.getItem("email");
  const avatarParam = params.picture || localStorage.getItem("avatar");
  const id = params.id || localStorage.getItem("userId");
  const role = params.role || localStorage.getItem("role");

  if (nameParam && emailParam) {
    user.value = {
      name: nameParam,
      email: emailParam,
      avatar: avatarParam
    };
  }

  if (token && id && role) {
    localStorage.setItem("authToken", `Bearer ${token}`);
    localStorage.setItem("userId", id);
    localStorage.setItem("role", role);
  }

  const timer = setInterval(() => {
    if (countdown.value <= 1) {
      clearInterval(timer);
      router.push( role == 'user' ? '/user/home' : "/admin/dashboard");
    } else {
      countdown.value--;
    }
  }, 1000);
});

const goToMailbox = () => {
  router.push('/chat');
};
</script>

<style scoped>
/* Optional transitions or custom styles */
</style>
