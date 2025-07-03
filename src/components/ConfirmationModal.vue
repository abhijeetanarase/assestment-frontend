<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(243,244,246,0.85);">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 relative">
      <div class="flex items-center mb-4">
        <AlertTriangle v-if="variant === 'danger'" class="w-6 h-6 text-red-500 mr-2" />
        <Info v-else class="w-6 h-6 text-blue-500 mr-2" />
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </div>
      <div class="mb-6 text-gray-700">
        {{ message }}
      </div>
      <div class="flex justify-end space-x-2">
        <button
          class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button
          :class="[
            'px-4 py-2 rounded text-white',
            variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          ]"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </div>
      <button
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        @click="$emit('cancel')"
        aria-label="Close"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle, Info, X } from 'lucide-vue-next'
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: 'Are you sure you want to proceed?' },
  confirmText: { type: String, default: 'Confirm' },
  variant: { type: String, default: 'primary' } // 'primary' or 'danger'
})
</script>
