<template>
  <div class="mb-8 bg-white p-6 rounded-lg shadow space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      <!-- Price Min -->
      <div>
        <label for="priceMin" class="block text-sm font-semibold text-gray-700 mb-1">Min Price</label>
        <input
          id="priceMin"
          v-model="localFilters.priceMin"
          type="number"
          placeholder="0"
          class="block w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>
      <!-- Price Max -->
      <div>
        <label for="priceMax" class="block text-sm font-semibold text-gray-700 mb-1">Max Price</label>
        <input
          id="priceMax"
          v-model="localFilters.priceMax"
          type="number"
          placeholder="10000"
          class="block w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>
      <!-- Category Multi-Select -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Category</label>
        <div class="max-h-40 overflow-y-auto border rounded-xl border-gray-200 p-2 bg-white">
          <div v-for="cat in categories" :key="cat" class="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              :id="'cat-' + cat"
              :value="cat"
              v-model="localFilters.category"
              class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            <label :for="'cat-' + cat" class="text-sm text-gray-700">{{ cat }}</label>
          </div>
        </div>
      </div>
      <!-- Stock Min -->
      <div>
        <label for="stockMin" class="block text-sm font-semibold text-gray-700 mb-1">Min Stock</label>
        <input
          id="stockMin"
          v-model="localFilters.stockMin"
          type="number"
          placeholder="0"
          class="block w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>
      <!-- Stock Max -->
      <div>
        <label for="stockMax" class="block text-sm font-semibold text-gray-700 mb-1">Max Stock</label>
        <input
          id="stockMax"
          v-model="localFilters.stockMax"
          type="number"
          placeholder="100"
          class="block w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>
      <!-- Low Stock -->
      <div class="flex items-center gap-3 pt-7">
        <input
          id="lowStock"
          type="checkbox"
          v-model="localFilters.lowStock"
          class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
        />
        <label for="lowStock" class="text-sm font-medium text-gray-700">Low Stock</label>
      </div>
      <!-- Out of Stock -->
      <div class="flex items-center gap-3 pt-7">
        <input
          id="outOfStock"
          type="checkbox"
          v-model="localFilters.outOfStock"
          class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
        />
        <label for="outOfStock" class="text-sm font-medium text-gray-700">Out of Stock</label>
      </div>
    </div>
    <!-- Buttons -->
    <div class="flex flex-wrap gap-4 pt-4 justify-end">
      <button
        @click="emitApply"
        class="inline-flex items-center px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Apply Filters
      </button>
      <button
        @click="emitReset"
        class="inline-flex items-center px-5 py-2 rounded-xl border border-gray-300 bg-white text-sm text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, ref } from 'vue'
import api from "../utils/api"

const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:filters', 'apply', 'reset'])

const localFilters = reactive({ ...props.filters })
const categories = ref([])

watch(
  () => props.filters,
  (newVal) => {
    Object.assign(localFilters, newVal)
  },
  { deep: true }
)

async function fetchCategories() {
  try {
    const res = await api.get('/product/categories')
    if (Array.isArray(res.data.categories)) {
      categories.value = res.data.categories
    } else {
      categories.value = []
    }
  } catch (error) {
    categories.value = []
  }
}

onMounted(() => {
  fetchCategories()
})

function emitApply() {
  emit('update:filters', { ...localFilters })
  emit('apply')
}

function emitReset() {
  emit('reset')
}
</script>
