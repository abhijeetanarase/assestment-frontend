<template>
  <nav class="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and main navigation -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link to="/user/home" class="flex items-center gap-2">
              <svg class="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 9H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 9H15.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Elevate Shop</span>
            </router-link>
          </div>
          
          <div class="hidden md:block ml-10">
            <div class="flex items-center space-x-6">
              <router-link 
                to="/user/home" 
                class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                active-class="text-indigo-600 font-semibold"
              >
                 Home
              </router-link>
              <router-link 
                to="/user/search" 
                class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                active-class="text-indigo-600 font-semibold"
              >
                <button class="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-indigo-600 transition-colors">
            <Search class="w-5 h-5" />
          </button>
                
              </router-link>
              <router-link 
                to="/user/profile" 
                class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                active-class="text-indigo-600 font-semibold"
              >
              <button class="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-indigo-600 transition-colors">
            <User class="w-5 h-5" />
          </button>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Right side icons -->
        <div class="flex items-center gap-4">
          <!-- Search button -->
        
          
          <!-- Wishlist -->
      
          
          <!-- User dropdown -->
          <div class="relative ml-2">
            <button 
              @click="toggleUserDropdown"
              class="flex items-center max-w-xs rounded-full focus:outline-none"
            >
              <span class="sr-only">Open user menu</span>
              <template v-if="user.picture">
                <img class="w-8 h-8 rounded-full border-2 border-indigo-100 object-cover" :src="user.picture" alt="User profile">
              </template>
              <template v-else>
                <div class="w-8 h-8 rounded-full border-2 border-indigo-100 bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-base">
                  {{ getInitials(user.name) }}
                </div>
              </template>
            </button>
            
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div 
                v-show="isUserDropdownOpen"
                class="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                @click.outside="isUserDropdownOpen = false"
              >
                <router-link 
                  to="/user/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User class="w-4 h-4 inline mr-2" />
                  Account
                </router-link>
                <button 
                  @click="logout" 
                  class="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut class="w-4 h-4 inline mr-2" />
                  Sign out
                </button>
              </div>
            </transition>
          </div>
          
          <!-- Mobile menu button -->
          <button 
            @click="toggleMobileMenu"
            class="p-2 text-gray-500 rounded-md hover:bg-gray-100 hover:text-indigo-600 md:hidden transition-colors"
          >
            <span class="sr-only">Open menu</span>
            <Menu class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-show="isMobileMenuOpen"
        class="md:hidden bg-white shadow-lg"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link 
            to="/shop" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            active-class="bg-indigo-50 text-indigo-600"
          >
            Shop
          </router-link>
          <router-link 
            to="/collections" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            active-class="bg-indigo-50 text-indigo-600"
          >
            Collections
          </router-link>
          <router-link 
            to="/new-arrivals" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            active-class="bg-indigo-50 text-indigo-600"
          >
            New Arrivals
          </router-link>
          <router-link 
            to="/about" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            active-class="bg-indigo-50 text-indigo-600"
          >
            About
          </router-link>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-5">
            <div class="flex-shrink-0">
              <template v-if="user.picture">
                <img class="w-10 h-10 rounded-full object-cover" :src="user.picture" alt="User profile">
              </template>
              <template v-else>
                <div class="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
                  {{ getInitials(user.name) }}
                </div>
              </template>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ user.name }}</div>
              <div class="text-sm font-medium text-gray-500">{{ user.email }}</div>
            </div>
          </div>
          <div class="mt-3 px-2 space-y-1">
            <router-link 
              to="/account" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              Account
            </router-link>
            <router-link 
              to="/orders" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              Orders
            </router-link>
            <a 
              href="#" 
              @click.prevent="logout"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              Sign out
            </a>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  Package, 
  LogOut, 
  Menu ,
} from 'lucide-vue-next';
import api from '../../../utils/api';

const isUserDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const router = useRouter();

const user = ref({
  name: '',
  email: '',
  picture: '',
});

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

async function fetchUserProfile() {
  try {
    const res = await api.get('/user/profile');
    user.value = {
      name: res.data.name || '',
      email: res.data.email || '',
      picture: res.data.picture || '',
    };
  } catch (e) {
    // fallback: guest
    user.value = { name: 'User', email: '', picture: '' };
  }
}

function logout() {
  localStorage.clear();
  sessionStorage.clear();
  router.push('/login');
}

function toggleUserDropdown() {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
}
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

onMounted(fetchUserProfile);
</script>