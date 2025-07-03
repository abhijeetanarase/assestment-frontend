<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(243,244,246,0.85);">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 relative">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h3>
      <div>
        <slot />
      </div>
      <div class="mt-6 flex justify-end space-x-2">
        <button
          class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          @click="$emit('confirm')"
        >
          Confirm
        </button>
      </div>
      <button
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        @click="$emit('cancel')"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: '' }
})
</script>
