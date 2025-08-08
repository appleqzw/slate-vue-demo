<template>
  <span
    class="container-X3mSoV"
    :class="{ 'hoverable-Trkk4u': props.hoverable }"
    :contentEditable="props.contentEditable"
  >
    <slot></slot>
  </span>
</template>
<script setup>
const props = defineProps({
  contentEditable: {
    type: [Boolean, String],
    default: undefined,
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
})
</script>
