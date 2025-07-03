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
    <!-- Header with toggle -->
    <div class="border-b border-gray-200 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Add Product</h2>
        <p class="text-gray-500 mt-1 text-sm">Fill the details to add a new product to your inventory.</p>
      </div>
      <div class="flex space-x-2">
        <button
          @click="addMode = 'manual'"
          :class="[
            'px-5 py-2 rounded-lg font-semibold transition-all duration-200',
            addMode === 'manual' 
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
          ]"
        >
          <span class="inline-flex items-center gap-2">
            <svg v-if="addMode === 'manual'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Manual Entry
          </span>
        </button>
        <button
          @click="addMode = 'bulk'"
          :class="[
            'px-5 py-2 rounded-lg font-semibold transition-all duration-200',
            addMode === 'bulk' 
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
          ]"
        >
          <span class="inline-flex items-center gap-2">
            <svg v-if="addMode === 'bulk'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16"/></svg>
            Bulk Upload
          </span>
        </button>
      </div>
    </div>

    <!-- Loader Component -->
    <Loader v-if="isLoading" class="mb-6" />

    <!-- Manual Entry Form -->
    <div v-if="addMode === 'manual'" class="space-y-8">
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
          @click="submitManualForm"
          class="px-7 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span class="inline-flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Save Product
          </span>
        </button>
      </div>
    </div>

    <!-- Bulk Upload Section -->
    <div v-else class="space-y-6">
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div class="flex justify-center">
          <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Upload your file</h3>
        <p class="mt-1 text-xs text-gray-500">CSV or Excel files up to 10MB</p>
        <div class="mt-4">
          <label for="file-upload" class="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Select File
          </label>
          <input id="file-upload" name="file-upload" type="file" class="sr-only" accept=".csv,.xlsx,.xls" @change="handleFileUpload" />
        </div>
        <p class="mt-2 text-xs text-gray-500" v-if="uploadedFile">
          Selected file: {{ uploadedFile.name }}
          <button @click="removeFile" class="text-red-500 hover:text-red-700 ml-2">Remove</button>
        </p>
        <p class="mt-2 text-xs text-red-500" v-if="bulkError">
          {{ bulkError }}
        </p>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg">
        <h4 class="text-sm font-medium text-blue-800">Bulk Upload Instructions</h4>
        <ul class="mt-2 text-xs text-blue-700 list-disc list-inside space-y-1">
          <li>Download our template file to ensure proper formatting</li>
          <li>Include product name, category, description, and status</li>
          <li>Maximum 100 products per upload</li>
          <li>Status should be either "active" or "inactive"</li>
        </ul>
        <button class="mt-3 text-xs text-blue-600 hover:text-blue-800 underline flex items-center">
          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Template
        </button>
      </div>

      <div class="flex justify-end pt-4">
        <button
          @click="submitBulkUpload"
          :disabled="!uploadedFile || isLoading"
          :class="[
            'px-6 py-2 rounded-lg text-white focus:outline-none focus:ring-2',
            uploadedFile || isLoading ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-blue-300 cursor-not-allowed'
          ]"
        >
          Upload Products
        </button>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div v-if="isCategoryModalOpen" class="fixed inset-0 flex items-center justify-center p-4 z-50" style="background: rgba(243, 244, 246, 0.85);">
      <div class="bg-white rounded-lg  max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Add New Category</h3>
          <button @click="isCategoryModalOpen = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label for="newCategory" class="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
            <input
              type="text"
              id="newCategory"
              v-model="newCategoryName"
              class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category name"
            />
          </div>
          <div class="flex justify-end space-x-3 pt-2">
            <button
              @click="isCategoryModalOpen = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="addNewCategory"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Category
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { baseUrl } from "../../../utils/constants";
import Loader from '../../../components/Loader.vue'


export default {
  components: {
    Loader
  },
  data() {
    return {
      addMode: 'manual', // 'manual' or 'bulk'
      isCategoryModalOpen: false,
      newCategoryName: '',
      uploadedFile: null,
      categories: [],
      product: {
        name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        status: 'active',
        image: null,
        imagePreview: null,
      },
      errors: {},
      bulkError: '',
      isLoading: false,
    }
  },
  methods: {
    toggleAddMode(mode) {
      this.addMode = mode
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.product.image = file
        this.product.imagePreview = URL.createObjectURL(file)
      }
    },
    removeImage() {
      this.product.image = null
      this.product.imagePreview = null
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.uploadedFile = file
      }
    },
    removeFile() {
      this.uploadedFile = null
    },
    addNewCategory() {
      if (this.newCategoryName.trim()) {
        const newId = this.newCategoryName.toLowerCase().replace(/\s+/g, '-')
        this.categories.push(
          this.newCategoryName
        )
        this.product.category = newId
        this.newCategoryName = ''
        this.isCategoryModalOpen = false
      }
    },
    resetForm() {
      this.product = {
        name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        status: 'active',
        image: null,
        imagePreview: null,
      }
    },
    async submitManualForm() {
      this.errors = {}
      // Name validation
      if (!this.product.name) {
        this.errors.name = 'Product name is required'
      } else if (this.product.name.length < 3) {
        this.errors.name = 'Product name must be at least 3 characters'
      } else if (this.product.name.length > 100) {
        this.errors.name = 'Product name must be less than 100 characters'
      }
      // Price validation
      if (this.product.price === '' || this.product.price === null) {
        this.errors.price = 'Price is required'
      } else if (isNaN(this.product.price) || Number(this.product.price) < 0) {
        this.errors.price = 'Price must be a positive number'
      }
      // Stock validation
      if (this.product.stock === '' || this.product.stock === null) {
        this.errors.stock = 'Stock is required'
      } else if (!Number.isInteger(Number(this.product.stock)) || Number(this.product.stock) < 0) {
        this.errors.stock = 'Stock must be a non-negative integer'
      }
      // Category validation
      if (!this.product.category) this.errors.category = 'Category is required'
      // Status validation
      if (!this.product.status) this.errors.status = 'Status is required'
      // Image validation
      if (!this.product.image) this.errors.image = 'Product image is required'
       if (this.product.image && this.product.image.size > 1 * 1024 * 1024) {
        this.errors.image = 'Image size must be less than 1MB'
        
       }
      // Description validation
      if (!this.product.description || this.product.description.trim().length < 10) {
        this.errors.description = 'Description is required (min 10 characters)'
      } else if (this.product.description.length > 1000) {
        this.errors.description = 'Description must be less than 1000 characters'
      }
      if (Object.keys(this.errors).length > 0) return

      this.isLoading = true
      try {
        const formData = new FormData();
        formData.append('name', this.product.name);
        formData.append('price', this.product.price);
        formData.append('stock', this.product.stock);
        formData.append('category', this.product.category);
        formData.append('description', this.product.description);
        formData.append('status', this.product.status);
        if (this.product.image) {
          formData.append('image', this.product.image);
        }

        const response = await axios.post(
          `${baseUrl}/product/add`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': localStorage.getItem('authToken') || ''
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              console.log(`Upload Progress: ${percentCompleted}%`);
            },
          }
        );
        console.log('Product submitted:', response.data)
        this.resetForm()
        this.$emit('productAdded', response.data)
      } catch (error) {
        console.error('Error submitting product:', error)
        this.errors.backend = 'Failed to submit product. Please try again.'
      } finally {
        this.isLoading = false
      }
    },
    async submitBulkUpload() {
      this.bulkError = ''
      if (!this.uploadedFile) {
        this.bulkError = 'Please select a file to upload.'
        return
      }
      const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      if (!allowedTypes.includes(this.uploadedFile.type)) {
        this.bulkError = 'Invalid file type. Please upload a CSV or Excel file.'
        return
      }
      if (this.uploadedFile.size > 5 * 1024 * 1024) {
        this.bulkError = 'File size exceeds 10MB limit.'
        return
      }

      this.isLoading = true
      const formData = new FormData();
      formData.append('file', this.uploadedFile);
      try {
        await axios.post(`${baseUrl}/product/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.getItem('authToken') || ''
          }
        });
        this.bulkError = 'Bulk upload successful!'
        this.uploadedFile = null
        this.$emit('bulkUploadSuccess')
      } catch (error) {
        console.log('Bulk upload error:', error);
      } finally {
        this.isLoading = false
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get(`${baseUrl}/product/categories`, {
          headers: {
            'Authorization': localStorage.getItem('authToken') || ''
          }
        });
        this.categories = response.data.categories || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.categories = [];
      }
    },
    
   

  }
,
  mounted() {
    this.fetchCategories()
    // Initialize product with default values
    this.product = {
      name: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      status: 'active',
      image: null,
      imagePreview: null,
    }
  }

  ,
  
}
</script>