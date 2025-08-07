<template>
  <Tooltip title="点击退出技能">
    <LabeledWrapper
      class="exit-skill-button-SKn9lH borderless-yNFhuy"
      contentEditable="false"
      @click="emit('close')"
    >
      <div
        class="flex items-center s-font-base-em text-s-color-brand-primary-default select-none"
      >
        {{ props.skillName }}
      </div>
    </LabeledWrapper>
  </Tooltip>
</template>
<script setup>
import { Tooltip } from 'ant-design-vue'
import LabeledWrapper from './LabeledWrapper.vue'
const emit = defineEmits(['close'])
const props = defineProps({
  skillName: {
    type: String,
  },
})
</script>
