<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Filter Section -->
    <ProductFilters
      :categories="categories"
      :filters="filters"
      @update:filters="onFiltersUpdate"
    />

    <!-- Product Grid -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in products"
          :key="product._id"
          class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <!-- Product Image -->
          <div class="relative aspect-square bg-gray-100">
            <img
              :src="product.imageUrl || '/placeholder-product.jpg'"
              :alt="product.name"
              class="w-full h-full object-cover"
              loading="lazy"
            >
            <!-- Stock Badge -->
            <span
              class="absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full"
              :class="{
                'bg-red-100 text-red-800': product.stockStatus === 'OutOfStock',
                'bg-yellow-100 text-yellow-800': product.stockStatus === 'Low',
                'bg-blue-100 text-blue-800': product.stockStatus === 'Medium',
                'bg-green-100 text-green-800': product.stockStatus === 'High'
              }"
            >
              {{ product.stock }} in stock
            </span>
            <!-- Status Badge -->
            <span
              v-if="product.status"
              class="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full"
              :class="{
                'bg-green-100 text-green-800': product.status === 'active',
                'bg-gray-100 text-gray-800': product.status === 'inactive'
              }"
            >
              {{ product.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-1 truncate">{{ product.name }}</h3>
            <p class="text-sm text-gray-500 mb-2">{{ product.category }}</p>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">${{ product.price }}</span>
              <div class="flex items-center">
                <span class="text-sm text-gray-500 mr-1">{{ product.rating }}</span>
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Actions -->
          
        </div>
      </div>

      <!-- Infinite Scroll Sentinel -->
      <div 
        ref="loadMoreTrigger" 
        v-if="!loading && hasMore"
        class="h-10 flex items-center justify-center"
      >
        <div v-if="loading" class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p v-if="endOfResults && !loading" class="text-gray-500">
         No more products to load
        </p>
      </div>

      <!-- No Results -->
      <div v-if="products.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">No products found matching your filters.</p>
        <button
          @click="resetFilters"
          class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, onBeforeUnmount, onUnmounted, nextTick } from 'vue';
import { debounce } from 'lodash-es';
import api from '../../utils/api';
import ProductFilters from '../../components/ProductFilters.vue';

// Reactive state
const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const totalItems = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const limit = ref(10);

const filters = ref({
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
});

const loadMoreTrigger = ref(null);
const hasMore = ref(true);
const endOfResults = ref(false);
let observer;

// Fetch products with current filters
const fetchProducts = async (isAppend = false) => {
  try {
    loading.value = true;
    // Prepare params
    let categoryParam = undefined;
    if (filters.value.category.length === 1) {
      categoryParam = filters.value.category[0];
    } else if (filters.value.category.length > 1) {
      categoryParam = filters.value.category;
    }
    const params = {
      page: currentPage.value,
      limit: limit.value,
      search: filters.value.search || undefined,
      priceMin: filters.value.priceMin || undefined,
      priceMax: filters.value.priceMax || undefined,
      stockMin: filters.value.stockMin || undefined,
      stockMax: filters.value.stockMax || undefined,
      category: categoryParam,
      lowStock: filters.value.lowStock ? "true" : undefined,
      medStock: filters.value.medStock ? "true" : undefined,
      highStock: filters.value.highStock ? "true" : undefined,
      outOfStock: filters.value.outOfStock ? "true" : undefined,
      status: filters.value.status || undefined,
      sortBy: filters.value.sortBy || undefined,
      order: filters.value.order || undefined,
    };
    // Serialize params like admin/Products.vue
    const query = Object.entries(params)
      .filter(([k, v]) => v !== undefined && v !== "")
      .map(([k, v]) =>
        Array.isArray(v)
          ? v.map(val => `${encodeURIComponent(k)}=${encodeURIComponent(val)}`).join("&")
          : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
      )
      .join("&");
    const response = await api.get(`/product?${query}`);
    
    const fetchedProducts = response.data.products || [];
    if (isAppend && currentPage.value > 1) {
      products.value = [...products.value, ...fetchedProducts];
    } else {
      products.value = fetchedProducts;
    }
    totalItems.value = response.data.total;
    totalPages.value = response.data.totalPages;
    
    // Extract unique categories if not already loaded
   

    // hasMore/endOfResults logic
    if (currentPage.value >= totalPages.value || fetchedProducts.length === 0) {
      hasMore.value = false;
      endOfResults.value = true;
    } else {
      hasMore.value = true;
      endOfResults.value = false;
    }

    // --- Infinite scroll observer re-attach ---
    if (observer && loadMoreTrigger.value) {
      observer.disconnect();
      observer.observe(loadMoreTrigger.value);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
};

// Apply filters with debounce for search
const debouncedFilter = debounce(() => {
  currentPage.value = 1;
  hasMore.value = true;
  endOfResults.value = false;
  fetchProducts();
}, 500);

const applyFilters = () => {
  currentPage.value = 1;
  hasMore.value = true;
  endOfResults.value = false;
  fetchProducts();
};

// Reset all filters
const resetFilters = () => {
  filters.value = {
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
  currentPage.value = 1;
  hasMore.value = true;
  endOfResults.value = false;
  fetchProducts();
};

// Infinite scroll logic (observer)
const handleIntersection = (entries) => {
  const firstEntry = entries[0];
  if (firstEntry.isIntersecting && hasMore.value && !loading.value) {
    currentPage.value++;
    fetchProducts(true);
  }
};

const fetchCategories = async () => {
  try {
    const response = await api.get('/product/categories');
    categories.value = response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

const setupObserver = () => {
  if (observer) observer.disconnect();
  observer = new window.IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  });
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }
};

onMounted(async () => {
  await fetchProducts();
  await fetchCategories();
  await nextTick();
  setupObserver();
});

watch([products, hasMore], async () => {
  await nextTick();
  setupObserver();
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

// Watch for changes in filters
watch(filters, (newVal, oldVal) => {
  // Don't trigger if only the search changed (handled by debounce)
  if (newVal.search !== oldVal.search) return;
  applyFilters();
}, { deep: true });

function onFiltersUpdate(newFilters) {
  filters.value = { ...filters.value, ...newFilters };
  applyFilters();
}
</script>