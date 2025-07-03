<template>
  <button
   type="button"
    :class="[
      'inline-flex items-center border font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition',
      variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700 border-transparent'
        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300',
      size === 'small' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm'
    ]"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'medium' }
})
</script>
