<template>
  <div class="admin-users">
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between mb-6">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-800">Users</h1>
          <p class="mt-1 text-sm text-gray-600">Manage your platform users</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="max-w-md w-full">
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                v-model="filters.search"
                @input="searchUsers"
                type="text"
                placeholder="Search users by name or email..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:ring-opacity-50 hover:border-gray-400"
              />
            </div>
          </div>
          <button
            @click="isInviteModalOpen = true"
            class="ml-4 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Invite
          </button>
        </div>
      </div>

      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Verified</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Registered Date</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-if="isLoading" v-for="n in itemsPerPage" :key="'skeleton-' + n">
                    <td v-for="i in 5" :key="i" class="px-3 py-4">
                      <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    </td>
                  </tr>
                  <tr v-else v-for="user in users" :key="user._id || user.id">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <img
                            class="h-10 w-10 rounded-full object-cover bg-gray-100"
                            :src="user.picture || 'https://ui-avatars.com/api/?name=' + (user.name || 'User')"
                            :alt="user.name ? user.name.slice(0, 30) : ''"
                          />
                        </div>
                        <div class="ml-4">
                          <div class="font-medium text-gray-900">{{ user.name ? user.name.slice(0, 30) : "" }}</div>
                         
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ user.email }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{{ user.role }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <span v-if="user.verified" class="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">Yes</span>
                      <span v-else class="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">No</span>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ formatDate(user.createdAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <PaginationComponent
          :current-page="currentPage"
          :total-items="total"
          :items-per-page="itemsPerPage"
          @update:page="handlePageChange"
        />
      </div>
      <BasicModal
        :isOpen="isInviteModalOpen"
        title="Invite a New User"
        @cancel="isInviteModalOpen = false"
        @confirm="submitInviteForm"
      >
        <form @submit.prevent="submitInviteForm" novalidate class="space-y-6">
          <div>
            <label for="invite-name" class="block text-sm font-medium text-gray-700 mb-1">Full Name <span class="text-red-500">*</span></label>
            <input
              id="invite-name"
              v-model="inviteForm.name"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-800 shadow-sm transition-all"
              placeholder="Enter full name"
              required
            />
            <p v-if="inviteErrors.name" class="text-red-500 text-xs mt-1 font-medium">{{ inviteErrors.name }}</p>
          </div>
          <div>
            <label for="invite-email" class="block text-sm font-medium text-gray-700 mb-1">Email Address <span class="text-red-500">*</span></label>
            <input
              id="invite-email"
              v-model="inviteForm.email"
              type="email"
              class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-800 shadow-sm transition-all"
              placeholder="Enter email address"
              required
            />
            <p v-if="inviteErrors.email" class="text-red-500 text-xs mt-1 font-medium">{{ inviteErrors.email }}</p>
          </div>
          <p v-if="inviteSuccess" class="text-green-600 text-sm mt-2">{{ inviteSuccess }}</p>
        </form>
      </BasicModal>
    </div>
  </div>
</template>

<script>
import PaginationComponent from '../../../components/PaginationComponent.vue';
import BasicModal from '../../../components/BasicModal.vue';
import api from '../../../utils/api';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

export default {
  name: 'AdminUsers',
  components: { PaginationComponent, BasicModal },
  data() {
    return {
      users: [],
      filters: {
        search: '',
      },
      isLoading: false,
      currentPage: 1,
      total: 0,
      itemsPerPage: 10,
      searchDebounceTimeout: null,
      isInviteModalOpen: false,
      inviteForm: { name: '', email: '' },
      inviteErrors: {},
      inviteSuccess: '',
    };
  },
  methods: {
    async fetchUsers(page = 1) {
      this.isLoading = true;
      try {
        const params = {
          page,
          limit: this.itemsPerPage,
          search: this.filters.search || undefined,
        };
        const query = Object.entries(params)
          .filter(([k, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&');
        const res = await api.get(`/user?${query}`);
        this.users = Array.isArray(res.data.data) ? res.data.data : (res.data.users || []);
        this.total = res.data.total || 0;
        this.currentPage = res.data.currentPage || page;
      } catch (error) {
        this.users = [];
      } finally {
        this.isLoading = false;
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchUsers(page);
    },
    searchUsers() {
      clearTimeout(this.searchDebounceTimeout);
      this.searchDebounceTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchUsers(1);
      }, 500);
    },
    formatDate,
    validateInviteForm() {
      const errors = {};
      if (!this.inviteForm.name || this.inviteForm.name.trim().length < 3) {
        errors.name = 'Name must be at least 3 characters.';
      } else if (this.inviteForm.name.length > 50) {
        errors.name = 'Name cannot exceed 50 characters.';
      }
      if (!this.inviteForm.email) {
        errors.email = 'Email is required.';
      } else if (!/^\S+@\S+\.\S+$/.test(this.inviteForm.email)) {
        errors.email = 'Please enter a valid email address.';
      }
      this.inviteErrors = errors;
      return Object.keys(errors).length === 0;
    },
    async submitInviteForm() {
      this.inviteSuccess = '';
      this.inviteErrors = {};
      if (!this.validateInviteForm()) return;
      try {
        const res = await api.post('/user/invite', this.inviteForm);
        this.inviteSuccess = res.data.message;
        this.inviteForm = { name: '', email: '' };
      } catch (e) {
        this.inviteErrors.email = e.response.data.message;
      }
    },
  },
  mounted() {
    this.fetchUsers(this.currentPage);
  },
};
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>