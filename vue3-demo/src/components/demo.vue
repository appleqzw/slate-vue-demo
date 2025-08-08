<template>
  <ChatInput
    :skill="skill"
    @update:skill="(v) => (skill = v)"
    :value="userInput"
    @send="handleSend"
    placeholder="描述你所想象的画面，角色，情绪，场景，风格..."
  />
</template>
<script setup lang="jsx">
import { ref } from 'vue'
import ChatInput from './ChatInput.vue'
import './style.css'
const initValue = () => [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]
const userInput = ref(initValue())
const skill = ref('')
const clearInput = () => {
  userInput.value = initValue()
}
const handleSend = () => {
  console.log(
    userInput.value?.map((item) => item?.children?.[0]?.text).join('\n')
  )
  clearInput()
}
</script>
