<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Profile Header -->
        <div class="bg-indigo-700 px-6 py-8 sm:px-10 sm:py-12">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div class="relative">
              <img
                class="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm"
                :src="user.picture || 'https://via.placeholder.com/150'"
                alt="Profile picture"
              >
              <button
                v-if="!isEditing"
                @click="isEditing = true"
                class="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <Pencil class="w-4 h-4 text-indigo-700" />
              </button>
            </div>
            <div class="text-center sm:text-left">
              <h1 class="text-2xl font-bold text-white">{{ user.name }}</h1>
              <p class="text-indigo-200">{{ user.email }}</p>
            </div>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="px-6 py-8 sm:px-10">
          <div class="flex justify-end mb-6">
            <button
              v-if="isEditing"
              @click="cancelEdit"
              class="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              v-if="isEditing"
              @click="saveProfile"
              class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              :disabled="isSaving"
            >
              <span v-if="!isSaving">Save Changes</span>
              <span v-else class="flex items-center">
                <Loader2 class="animate-spin mr-2 h-4 w-4" />
                Saving...
              </span>
            </button>
            <button
              v-else
              @click="isEditing = true"
              class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          </div>

          <!-- View Mode -->
          <div v-if="!isEditing" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
              <dl class="mt-4 space-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ user.name }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ user.email }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Edit Mode -->
          <form v-else @submit.prevent="saveProfile" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
              <div class="mt-4 space-y-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    v-model="editUser.name"
                    class="mt-1 block w-full py-2 px-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                  <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    v-model="editUser.email"
                    class="mt-1 block w-full py-2 px-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                  <p v-if="errors.email" class="text-sm text-red-600 mt-1">{{ errors.email }}</p>
                </div>

                <div>
                  <label for="picture" class="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <input
                    type="file"
                    id="picture"
                    accept="image/*"
                    @change="handlePictureChange"
                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  >
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Pencil, Loader2 } from 'lucide-vue-next';
import api from '../../../utils/api';

const isEditing = ref(false);
const isSaving = ref(false);
const pictureFile = ref(null);

const errors = reactive({
  name: '',
  email: ''
});

const user = reactive({
  name: '',
  email: '',
  picture: '',
});

const editUser = reactive({ ...user });

const handlePictureChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    pictureFile.value = file;
    editUser.picture = URL.createObjectURL(file);
  }
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validateForm = () => {
  let isValid = true;
  errors.name = '';
  errors.email = '';

  if (!editUser.name.trim()) {
    errors.name = 'Name is required.';
    isValid = false;
  } else if (editUser.name.length < 3) {
    errors.name = 'Name must be at least 3 characters.';
    isValid = false;
  } else if (editUser.name.length > 50) {
    errors.name = 'Name must be less than 50 characters.';
    isValid = false;
  }

  if (!editUser.email.trim()) {
    errors.email = 'Email is required.';
    isValid = false;
  } else if (!validateEmail(editUser.email)) {
    errors.email = 'Invalid email format.';
    isValid = false;
  }

  return isValid;
};

const fetchProfile = async () => {
  try {
    const response = await api.get(`/user/profile`);
    Object.assign(user, response.data);
    Object.assign(editUser, response.data);
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  Object.assign(editUser, user);
  pictureFile.value = null;
};

const saveProfile = async () => {
  if (!validateForm()) return;

  isSaving.value = true;

  try {
    const formData = new FormData();
    formData.append('name', editUser.name);
    formData.append('email', editUser.email);
    if (pictureFile.value) {
      formData.append('picture', pictureFile.value);
    }

    const res = await api.put('/user/profile', formData);
    Object.assign(user, editUser);
    isEditing.value = false;
    pictureFile.value = null;
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Failed to update profile. Please try again.');
  } finally {
    isSaving.value = false;
  }
};

onMounted(fetchProfile);
</script>
