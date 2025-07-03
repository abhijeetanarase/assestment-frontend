<template>
  <div class="admin-layout min-h-screen bg-gray-100">
    <AdminNavbar @toggle-sidebar="toggleSidebar" />
    <div class="flex pt-16">
      <AdminSidebar :is-sidebar-open="isSidebarOpen" />
      <main class="w-full p-4 transition-all duration-300" :class="{'md:ml-64': isSidebarOpen}">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import AdminNavbar from '../components/admin/AdminNavbar/AdminNavbar.vue'
import AdminSidebar from '../components/admin/AdminSidebar/AdminSidebar.vue'

export default {
  name: 'AdminLayout',
  components: {
    AdminNavbar,
    AdminSidebar
  },
  data() {
    return {
      isSidebarOpen: true
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    }
  }
}
</script>