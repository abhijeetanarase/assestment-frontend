<template>
  <nav class="fixed w-full z-10 bg-white border-b border-gray-200 px-4 py-2.5 md:px-5 shadow-sm">
    <div class="flex flex-wrap justify-between items-center">
      <div class="flex justify-start items-center">
        <button 
          @click="toggleSidebar"
          class="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
          </svg>
        </button>
        <router-link to="/admin/dashboard" class="flex items-center justify-between mr-4">
          <span class="self-center text-2xl font-semibold whitespace-nowrap text-blue-600">Admin Panel</span>
        </router-link>
      </div>
      
      <div class="flex items-center lg:order-2">
       
        
        <div class="relative">
          <button 
            @click="toggleUserDropdown"
            class="flex mx-3 text-sm bg-gray-200 rounded-full md:mr-0 focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <span class="sr-only">Open user menu</span>
            <template v-if="user.picture">
              <img class="w-8 h-8 rounded-full object-cover" :src="user.picture" alt="user photo">
            </template>
            <template v-else>
              <div class="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-base">
                {{ getInitials(user.name) }}
              </div>
            </template>
          </button>
          
          <transition name="fade">
          <div 
            v-show="isUserDropdownOpen"
            class="absolute right-0 z-50 my-4 w-56 text-base list-none bg-white rounded-lg divide-y divide-gray-100 shadow-lg border border-gray-100"
          >
            <div class="py-3 px-4">
              <span class="block text-sm font-semibold text-gray-900">{{ user.name }}</span>
              <span class="block text-sm text-gray-500 truncate">{{ user.email }}</span>
            </div>
            <ul class="py-1">
              <li>
                <router-link to="/admin/dashboard" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">Dashboard</router-link>
              </li>
              <li>
                <button @click="logout" class="w-full text-left block py-2 px-4 text-sm text-red-600 hover:bg-red-50">Sign out</button>
              </li>
            </ul>
          </div>
          </transition>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import api from '../../../utils/api';
export default {
  name: 'AdminNavbar',
  data() {
    return {
      isUserDropdownOpen: false,
      user: {
        name: '',
        email: '',
        picture: '',
      }
    }
  },
  methods: {
    toggleUserDropdown() {
      this.isUserDropdownOpen = !this.isUserDropdownOpen
    },
    toggleSidebar() {
      this.$emit('toggle-sidebar')
    },
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      this.$router.push('/login');
    },
    getInitials(name) {
      if (!name) return 'A';
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0][0].toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    },
    async fetchUserProfile() {
      try {
        const res = await api.get('/user/profile');
        this.user = {
          name: res.data.name || '',
          email: res.data.email || '',
          picture: res.data.picture || '',
        };
      } catch (e) {
        this.user = { name: 'Admin', email: '', picture: '' };
      }
    }
  },
  mounted() {
    this.fetchUserProfile();
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>