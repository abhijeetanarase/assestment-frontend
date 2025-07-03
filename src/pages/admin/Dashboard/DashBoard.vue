<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow p-6 flex items-center gap-4">
        <div class="bg-blue-100 text-blue-600 rounded-full p-3">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 12h18M3 17h18"/></svg>
        </div>
        <div>
          <div class="text-2xl font-bold">{{ stats.products }}</div>
          <div class="text-gray-500 text-sm">Total Products</div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow p-6 flex items-center gap-4">
        <div class="bg-green-100 text-green-600 rounded-full p-3">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 12l2 2 4-4"/></svg>
        </div>
        <div>
          <div class="text-2xl font-bold">{{ stats.categories }}</div>
          <div class="text-gray-500 text-sm">Categories</div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow p-6 flex items-center gap-4">
        <div class="bg-purple-100 text-purple-600 rounded-full p-3">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-7V7a4 4 0 10-8 0v2m12 4v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h12a2 2 0 012 2z"/></svg>
        </div>
        <div>
          <div class="text-2xl font-bold">{{ stats.users }}</div>
          <div class="text-gray-500 text-sm">Users</div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow p-6 flex items-center gap-4">
        <div class="bg-red-100 text-red-600 rounded-full p-3">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14v1a2 2 0 01-2 2H7a2 2 0 01-2-2v-1"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 11v6m-6-6a6 6 0 1112 0 6 6 0 01-12 0z"/></svg>
        </div>
        <div>
          <div class="text-2xl font-bold">{{ stats.outOfStock }}</div>
          <div class="text-gray-500 text-sm">Out of Stock</div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow p-6 flex items-center gap-4">
        <div class="bg-indigo-100 text-indigo-600 rounded-full p-3">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div>
          <div class="text-2xl font-bold">{{ stats.activeProducts }}</div>
          <div class="text-gray-500 text-sm">Active Products</div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow p-6 flex items-center gap-4">
        <div class="bg-yellow-100 text-yellow-600 rounded-full p-3">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636l-1.414 1.414A8 8 0 105.636 18.364l1.414-1.414"/></svg>
        </div>
        <div>
          <div class="text-2xl font-bold">{{ stats.inactiveProducts }}</div>
          <div class="text-gray-500 text-sm">Inactive Products</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../utils/api';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {
        products: 0,
        categories: 0,
        users: 0,
        outOfStock: 0,
        activeProducts: 0,
        inactiveProducts: 0,
      },
    };
  },
  async mounted() {
    await this.fetchStats();
  },
  methods: {
    async fetchStats() {
      try {
        // Products
        const response = await api.get('/user/stats');
        this.stats = response.data.stats;
      } catch (e) {
        // Handle error
      }
    },
  },
};
</script>

<style scoped>
/* Responsive grid and card hover */
.grid > div {
  transition: transform 0.15s, box-shadow 0.15s;
}
.grid > div:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 8px 32px 0 rgba(60,60,120,0.10);
}
</style>