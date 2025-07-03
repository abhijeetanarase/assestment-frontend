<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm text-gray-700">
    <!-- Item range display -->
    <div>
      Showing <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of <strong>{{ totalItems }}</strong>
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center gap-1">
      <button
        class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        style="padding: 0.5rem;"
        :disabled="currentPage === 1"
        @click="goToPage(1)"
      >
        <ChevronsLeft class="w-4 h-4" />
      </button>
      <button
        class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        style="padding: 0.5rem;"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <span class="px-3 text-gray-700">
        {{ $t ? $t('Page') : 'Page' }} <strong>{{ currentPage }}</strong> {{ $t ? $t('of') : 'of' }} <strong>{{ totalPages }}</strong>
      </span>
      <button
        class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        style="padding: 0.5rem;"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
      <button
        class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        style="padding: 0.5rem;"
        :disabled="currentPage === totalPages"
        @click="goToPage(totalPages)"
      >
        <ChevronsRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, getCurrentInstance } from 'vue'
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-vue-next'

const props = defineProps<{
  currentPage: number
  totalItems: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const startItem = computed(() =>
  props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1
)

const endItem = computed(() =>
  Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
)

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:page', page)
  }
}

// For i18n support, expose $t if vue-i18n is installed
const { appContext } = getCurrentInstance() || {}
const $t = appContext?.config.globalProperties.$t
</script>

