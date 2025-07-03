<template>
  <aside 
    class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 md:translate-x-0"
    :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }"
  >
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white flex flex-col justify-between">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.label">
          <router-link 
            :to="item.to"
            class="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
            :class="isActiveTab(item) ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' : ''"
          >
            <span class="w-6 h-6 flex items-center justify-center">
              <component :is="item.icon" class="w-5 h-5" />
            </span>
            <span class="ml-3">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
import { useRoute } from 'vue-router';

// Simple SVG icon components
const DashboardIcon = {
  template: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"/></svg>'
};
const UsersIcon = {
  template: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-7V7a4 4 0 10-8 0v2m12 4v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h12a2 2 0 012 2z"/></svg>'
};
const ProductsIcon = {
  template: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 12h18M3 17h18"/></svg>'
};
const SettingsIcon = {
  template: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
};

export default {
  name: 'AdminSidebar',
  props: {
    isSidebarOpen: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const route = useRoute();
    const navItems = [
      { label: 'Dashboard', to: '/admin/dashboard', icon: DashboardIcon },
      { label: 'Users', to: '/admin/users', icon: UsersIcon },
      { label: 'Products', to: '/admin/products', icon: ProductsIcon },
    ];
    function isActiveTab(item) {
      // lowercase label in path
      const path = route.path.toLowerCase();
      return path.includes(item.label.toLowerCase());
    }
    return { navItems, isActiveTab };
  }
}
</script>