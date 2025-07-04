<template>
  <section class="py-12 bg-white">
    <div class="container mx-auto px-4">
      <!-- Section header -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Clothing Section</h2>
          <p class="text-gray-500 mt-2">Explore the latest in fashion clothing</p>
        </div>
        <router-link 
          to="/user/search" 
          class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          View All
          <ArrowRight class="w-4 h-4 ml-2" />
        </router-link>
      </div>

      <!-- Yellow Notice -->
     

      <!-- Product grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.025]"
        >
          <!-- Product image -->
          <div class="aspect-square bg-gray-100 overflow-hidden relative">
            <img 
              :src="product.imageUrl" 
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            >
            <!-- Gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-col gap-2 z-10">
              <span v-if="product.isOutOfStock" class="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full shadow">Out of Stock</span>
              <span v-if="product.stockStatus == 'Low'" class="px-2 py-1 text-xs font-bold text-white bg-rose-500 rounded-full shadow">Low Stock</span>
              <span v-if="product.stockStatus == 'High'" class="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full shadow">High Stock</span>
              <span v-if="product.stockStatus == 'Medium'" class="px-2 py-1 text-xs font-bold text-white bg-purple-500 rounded-full shadow">Medium Stock</span>
            </div>
            <!-- In stock glass badge -->
            <div class="absolute bottom-3 right-3 z-10">
              <span class="px-3 py-1 text-xs font-semibold text-indigo-900 bg-white/60 backdrop-blur-md rounded-full shadow border border-indigo-100">
                {{ product.stock + ' in stock' }}
              </span>
            </div>
          </div>

          <!-- Product details -->
          <div class="p-5 flex flex-col gap-2">
            <h3 class="text-lg font-bold text-gray-900 mb-0.5 truncate leading-tight group-hover:text-indigo-700 transition-colors">{{ product.name }}</h3>
            <p class="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-0.5">{{ product.category }}</p>
            <p class="text-sm text-gray-500 mb-1 leading-snug">{{ product.description.slice(0, 40) + (product.description.length > 40 ? '...' : '') }}</p>
            <div class="flex items-end justify-between mt-2">
              <div class="flex items-baseline gap-2">
                <span class="text-xl font-extrabold text-gray-900">${{ product.price }}</span>
                <span v-if="product.originalPrice" class="text-sm text-gray-400 line-through font-medium">${{ product.originalPrice }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading indicator and observer target -->
      <div 
        ref="loadMoreTrigger" 
        class="h-10 flex items-center justify-center"
      >
        <div v-if="loading" class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p v-if="endOfResults && !loading" class="text-gray-500">
          You've reached the end Clothing Section
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ArrowRight,  } from 'lucide-vue-next';
import api from '../../utils/api';

const products = ref([]);
const loading = ref(false);
const endOfResults = ref(false);
const loadMoreTrigger = ref(null);
const currentPage = ref(1);
const hasMore = ref(true);

// Fetch products from API
const fetchProducts = async (page) => {
  try {
    loading.value = true;
    const response = await api.get(`/product?page=${page}&category=Clothing`);
    
    return response.data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  } finally {
    loading.value = false;
  }
};

// Load initial products
const loadInitialProducts = async () => {
  const initialProducts = await fetchProducts(1);
  products.value = initialProducts;
  hasMore.value = initialProducts.length > 0;
};

// Load more products
const loadMoreProducts = async () => {
  if (loading.value || !hasMore.value) return;
  
  currentPage.value++;
  const newProducts = await fetchProducts(currentPage.value);
  
  if (newProducts.length === 0) {
    hasMore.value = false;
    endOfResults.value = true;
    return;
  }
  
  products.value = [...products.value, ...newProducts];
};

// Intersection observer callback
const handleIntersection = (entries) => {
  const firstEntry = entries[0];
  if (firstEntry.isIntersecting && hasMore.value && !loading.value) {
    loadMoreProducts();
  }
};

// Set up intersection observer
let observer;
onMounted(async () => {
  await loadInitialProducts();
  
  observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  });
  
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }
});

// Clean up observer
onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
/* कार्ड के लिए स्मूथ शैडो और होवर */
.group:hover {
  box-shadow: 0 8px 32px 0 rgba(60,60,120,0.13), 0 1.5px 6px 0 rgba(60,60,120,0.07);
}

/* इमेज पर gradient overlay */
.aspect-square > .bg-gradient-to-t {
  pointer-events: none;
}

/* बैजेस को और prominent */
.bg-red-600, .bg-rose-500, .bg-green-500, .bg-purple-500 {
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
}

/* इन-स्टॉक ग्लास बैज */
.bg-white\/60 {
  backdrop-filter: blur(6px);
  border: 1px solid #e0e7ff;
}

/* responsive gap */
@media (max-width: 640px) {
  .grid {
    gap: 1.25rem !important;
  }
}
</style>