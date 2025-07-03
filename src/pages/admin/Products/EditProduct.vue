<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
    <!-- Back Button -->
    <button
      @click="$router.push('/admin/products')"
      class="mb-4 flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-lg text-blue-700 font-semibold bg-white hover:bg-blue-50 transition-all shadow-sm"
      type="button"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      Back
    </button>
    <!-- Header -->
    <div class="border-b border-gray-200 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Edit Product</h2>
        <p class="text-gray-500 mt-1 text-sm">Update the details of your product below.</p>
      </div>
    </div>

    <Loader v-if="isLoading" class="mb-6" />

    <form @submit.prevent="submitEditForm" novalidate class="space-y-8">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <!-- Product Name -->
        <div class="sm:col-span-2">
          <label for="name" class="block text-base font-semibold text-gray-700 mb-1">Product Name <span class="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            v-model="product.name"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-800 shadow-sm transition-all"
            placeholder="Enter product name"
            required
            autofocus
          />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1 font-medium">{{ errors.name }}</p>
        </div>

        <!-- Price -->
        <div>
          <label for="price" class="block text-base font-semibold text-gray-700 mb-1">Price <span class="text-red-500">*</span></label>
          <input
            type="number"
            id="price"
            v-model="product.price"
            min="0"
            step="0.01"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-800 shadow-sm transition-all"
            placeholder="Enter price"
            required
          />
          <p v-if="errors.price" class="text-red-500 text-xs mt-1 font-medium">{{ errors.price }}</p>
        </div>

        <!-- Stock -->
        <div>
          <label for="stock" class="block text-base font-semibold text-gray-700 mb-1">Stock <span class="text-red-500">*</span></label>
          <input
            type="number"
            id="stock"
            v-model="product.stock"
            min="0"
            step="1"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-800 shadow-sm transition-all"
            placeholder="Enter stock quantity"
            required
          />
          <p v-if="errors.stock" class="text-red-500 text-xs mt-1 font-medium">{{ errors.stock }}</p>
        </div>

        <!-- Category with add new option -->
        <div>
          <label for="category" class="block text-base font-semibold text-gray-700 mb-1">Category <span class="text-red-500">*</span></label>
          <div class="flex space-x-2">
            <select
              id="category"
              v-model="product.category"
              class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 shadow-sm transition-all"
            >
              <option value="">Select category</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              <option value="new">+ Add New Category</option>
            </select>
            <button
              v-if="product.category === 'new'"
              type="button"
              @click="isCategoryModalOpen = true"
              class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all"
            >
              Add
            </button>
          </div>
          <p v-if="errors.category" class="text-red-500 text-xs mt-1 font-medium">{{ errors.category }}</p>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-base font-semibold text-gray-700 mb-1">Status</label>
          <div class="flex items-center space-x-6">
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                v-model="product.status"
                value="active"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-gray-700 font-medium">Active</span>
            </label>
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                v-model="product.status"
                value="inactive"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-gray-700 font-medium">Inactive</span>
            </label>
          </div>
          <p v-if="errors.status" class="text-red-500 text-xs mt-1 font-medium">{{ errors.status }}</p>
        </div>

        <!-- Image Upload -->
        <div class="sm:col-span-2">
          <label class="block text-base font-semibold text-gray-700 mb-1">Product Image <span class="text-red-500">*</span></label>
          <div class="mt-1 flex items-center gap-6 flex-wrap">
            <div class="relative group">
              <img
                v-if="product.imagePreview"
                :src="product.imagePreview"
                class="h-28 w-28 rounded-lg object-cover border-2 border-gray-200 shadow group-hover:scale-105 transition-all duration-200"
              />
              <div
                v-else
                class="h-28 w-28 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-white group-hover:bg-blue-50 transition-all cursor-pointer"
              >
                <span class="text-gray-400 text-sm">No image</span>
              </div>
              <input
                type="file"
                @change="handleImageUpload"
                accept="image/*"
                class="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
              />
            </div>
            <button
              v-if="product.imagePreview"
              @click="removeImage"
              class="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-semibold shadow-sm transition-all"
            >
              Remove
            </button>
          </div>
          <p v-if="errors.image" class="text-red-500 text-xs mt-1 font-medium">{{ errors.image }}</p>
        </div>

        <!-- Description -->
        <div class="sm:col-span-2">
          <label for="description" class="block text-base font-semibold text-gray-700 mb-1">Description <span class="text-red-500">*</span></label>
          <textarea
            id="description"
            v-model="product.description"
            rows="4"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-800 shadow-sm transition-all"
            placeholder="Enter product description"
          ></textarea>
          <p v-if="errors.description" class="text-red-500 text-xs mt-1 font-medium">{{ errors.description }}</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6">
        <button
          type="button"
          @click="resetForm"
          class="px-5 py-2 border border-blue-200 rounded-lg text-blue-700 font-semibold bg-white hover:bg-blue-50 transition-all shadow-sm"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="isLoading"
          class="px-7 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span class="inline-flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
            Update Product
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Loader from '../../../components/Loader.vue';
import api from '../../../utils/api';

export default {
  name: 'EditProduct',
  components: { Loader },
  data() {
    return {
      isLoading: false,
      product: {
        name: '',
        price: '',
        stock: '',
        category: '',
        status: 'active',
        image: null,
        imagePreview: '',
        description: '',
      },
      categories: [],
      errors: {},
      isCategoryModalOpen: false,
    };
  },
  created() {
    this.fetchCategories();
    this.fetchProduct();
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await api.get('/product/categories');
        this.categories = res.data.categories || [];
      } catch (e) {
        this.categories = [];
      }
    },
    async fetchProduct() {
      this.isLoading = true;
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/product/${id}`);
        const p = res.data.product || {};
        this.product = {
          name: p.name || '',
          price: p.price || '',
          stock: p.stock || '',
          category: p.category || '',
          status: p.status || 'active',
          image: null,
          imagePreview: p.imageUrl || '',
          description: p.description || '',
        };
      } catch (e) {
        // handle error
      } finally {
        this.isLoading = false;
      }
    },
    handleImageUpload(e) {
      const file = e.target.files[0];
      if (file) {
        this.product.image = file;
        this.product.imagePreview = URL.createObjectURL(file);
      }
    },
    removeImage() {
      this.product.image = null;
      this.product.imagePreview = '';
    },
    resetForm() {
      this.fetchProduct();
      this.errors = {};
    },
    validateForm() {
      const errors = {};
      // Name validation
      if (!this.product.name || this.product.name.trim().length < 3) {
        errors.name = 'Name must be at least 3 characters.';
      } else if (this.product.name.length > 50) {
        errors.name = 'Name cannot exceed 50 characters.';
      }
      // Price validation
      if (this.product.price === '' || isNaN(this.product.price) || Number(this.product.price) < 0) {
        errors.price = 'Price must be 0 or greater.';
      } else if (Number(this.product.price) > 1000000) {
        errors.price = 'Price cannot exceed 1,000,000.';
      }
      // Stock validation
      if (this.product.stock === '' || isNaN(this.product.stock) || Number(this.product.stock) < 0) {
        errors.stock = 'Stock must be 0 or greater.';
      } else if (Number(this.product.stock) > 100000) {
        errors.stock = 'Stock cannot exceed 100,000.';
      }
      // Category validation
      if (!this.product.category) {
        errors.category = 'Category is required.';
      }
      // Description validation
      if (!this.product.description || this.product.description.trim().length < 10) {
        errors.description = 'Description must be at least 10 characters.';
      } else if (this.product.description.length > 500) {
        errors.description = 'Description cannot exceed 500 characters.';
      }
      // Image validation (optional)
      // if (!this.product.imagePreview) {
      //   errors.image = 'Product image is required.';
      // }
      // Status validation
      if (!['active', 'inactive'].includes(this.product.status)) {
        errors.status = 'Status is required.';
      }
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    async submitEditForm() {
      this.isLoading = true;
      this.errors = {};
      // Validation
      if (!this.validateForm()) {
        this.isLoading = false;
        return;
      }
      try {
        const id = this.$route.params.id;
        const formData = new FormData();
        formData.append('name', this.product.name);
        formData.append('price', this.product.price);
        formData.append('stock', this.product.stock);
        formData.append('category', this.product.category);
        formData.append('status', this.product.status);
        formData.append('description', this.product.description);
        if (this.product.image) {
          formData.append('image', this.product.image);
        }
        await api.put(`/product/update/${id}`, formData);
        this.$router.push('/admin/products');
      } catch (e) {
        if (e.response && e.response.data && e.response.data.errors) {
          this.errors = e.response.data.errors;
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
