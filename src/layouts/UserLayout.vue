<template>
  <div class="user-layout min-h-screen bg-gray-50">
    <UserNavbar />
    <main class="pt-16">
      <router-view />
    </main>
    <UserFooter />
  </div>
</template>

<script>

import UserFooter from '../components/user/UserFooter/UserFooter.vue';
import UserNavbar from '../components/user/UserNavbar/UserNavbar.vue';

export default {
  name: 'UserLayout',
  components: {
    UserNavbar,
    UserFooter
  }
}
</script>