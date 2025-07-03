<template>
  <div class="bg-white p-6 rounded-xl shadow-lg space-y-6 mb-8">
    <!-- Top Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Search -->
      <div v-if="!isAdmin">
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Search products..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @input="debouncedFilter"
        >
      </div>

      <!-- Price Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
        <div class="flex items-center gap-2">
          <input
            v-model.number="localFilters.priceMin"
            type="number"
            placeholder="Min"
            class="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            @input="emitFilters"
          >
          <span class="text-gray-500">-</span>
          <input
            v-model.number="localFilters.priceMax"
            type="number"
            placeholder="Max"
            class="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            @input="emitFilters"
          >
        </div>
      </div>

      <!-- Stock Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Stock Range</label>
        <div class="flex items-center gap-2">
          <input
            v-model.number="localFilters.stockMin"
            type="number"
            placeholder="Min"
            class="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            @input="emitFilters"
          >
          <span class="text-gray-500">-</span>
          <input
            v-model.number="localFilters.stockMax"
            type="number"
            placeholder="Max"
            class="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            @input="emitFilters"
          >
        </div>
      </div>

      <!-- Categories -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Categories</label>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="category in categories"
            :key="category"
            class="inline-flex items-center space-x-2 text-sm text-gray-700"
          >
            <input
              type="checkbox"
              :value="category"
              v-model="localFilters.category"
              class="text-indigo-600 focus:ring-indigo-500 rounded"
              @change="emitFilters"
            />
            <span>{{ category }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Stock Levels -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Stock Level</label>
      <div class="flex flex-wrap gap-4">
        <label class="inline-flex items-center space-x-2">
          <input
            v-model="localFilters.lowStock"
            type="checkbox"
            class="text-indigo-600 focus:ring-indigo-500 rounded"
            @change="emitFilters"
          />
          <span class="text-sm text-gray-700">Low (≤10)</span>
        </label>
        <label class="inline-flex items-center space-x-2">
          <input
            v-model="localFilters.medStock"
            type="checkbox"
            class="text-indigo-600 focus:ring-indigo-500 rounded"
            @change="emitFilters"
          />
          <span class="text-sm text-gray-700">Medium (11–20)</span>
        </label>
        <label class="inline-flex items-center space-x-2">
          <input
            v-model="localFilters.highStock"
            type="checkbox"
            class="text-indigo-600 focus:ring-indigo-500 rounded"
            @change="emitFilters"
          />
          <span class="text-sm text-gray-700">High (&gt;20)</span>
        </label>
        <label class="inline-flex items-center space-x-2">
          <input
            v-model="localFilters.outOfStock"
            type="checkbox"
            class="text-indigo-600 focus:ring-indigo-500 rounded"
            @change="emitFilters"
          />
          <span class="text-sm text-gray-700">Out of Stock</span>
        </label>
      </div>
    </div>

    <!-- Status & Sorting -->
    <div class="flex flex-wrap gap-6 items-end">
      <div v-if="isAdmin">
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          v-model="localFilters.status"
          class="w-40 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          @change="emitFilters"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
        <select
          v-model="localFilters.sortBy"
          class="w-40 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          @change="emitFilters"
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Order</label>
        <select
          v-model="localFilters.order"
          class="w-40 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          @change="emitFilters"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <button
        @click="resetLocalFilters"
        class="ml-auto bg-gray-100 text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, watch , onMounted} from 'vue';
import { debounce } from 'lodash-es';
import api from '../utils/api';

const categories = ref([]);
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  filters: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['update:filters', 'filter-change']);
const localFilters = ref({ ...props.filters });
const  isAdmin =  localStorage.getItem('role') === 'admin';

watch(() => props.filters, (newVal) => {
  localFilters.value = { ...newVal };
});

const emitFilters = () => {
  emit('update:filters', { ...localFilters.value });
  emit('filter-change', { ...localFilters.value });
};

const fetchCategories = async () => {
  try {
    const response = await api.get('/product/categories');
    categories.value = response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

const debouncedFilter = debounce(emitFilters, 500);
 
const resetLocalFilters = () => {
  localFilters.value = {
    search: '',
    priceMin: null,
    priceMax: null,
    stockMin: null,
    stockMax: null,
    category: [],
    lowStock: false,
    medStock: false,
    highStock: false,
    outOfStock: false,
    status: '',
    sortBy: 'createdAt',
    order: 'desc'
  };
  emitFilters();
};

onMounted(async () => {
  await fetchCategories();
});
</script> 