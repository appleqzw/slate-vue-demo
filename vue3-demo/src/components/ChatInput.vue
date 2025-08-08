<template>
  <div class="container-QrxCka" style="width: 500px">
    <div class="editor-container-yj5w_H">
      <div class="editor-wrapper-AdiwSu">
        <div class="editor-u_GcDR flex items-start w-full">
          <ExitSkillButton
            v-if="isEmpty && hasSkill"
            :skillName="skillDict[skill]"
            @close="handleExitSkill"
          />

          <ChatEditor
            ref="editorRef"
            :value="props.value"
            :placeholder="props.placeholder"
            :hasPrefix="!isEmpty && hasSkill"
            :disabled="props.disabled"
            :autoFocus="props.autoFocus"
            @keydown="handleKeyDown"
          >
            <template v-if="!isEmpty && hasSkill" #prefix>
              <ExitSkillButton
                :skillName="skillDict[skill]"
                @close="handleExitSkill"
              />
            </template>
          </ChatEditor>
        </div>
      </div>

      <div class="bottom-wrapper-PqK2vl">
        <div class="left-tools-wrapper-INTHKl">
          <div class="bp5-overflow-list overflow-list-NyrGXN">
            <Dropdown :trigger="['click']">
              <Button type="default">技能</Button>
              <template #overlay>
                <Menu>
                  <MenuItem
                    v-for="item in skillOptions"
                    :key="item.value"
                    @click="chooseSkill(item)"
                  >
                    {{ item.label }}
                  </MenuItem>
                </Menu>
              </template>
            </Dropdown>
            <div class="bp5-overflow-list-spacer"></div>
          </div>
        </div>

        <div class="tools-placeholder-QV9wFb"></div>

        <div class="right-tools-wrapper-HlP9ga">
          <div class="container-T4Zbge">
            <div class="right-area-zo66jb">
              <div
                class="container-LQV0KD send-btn-wrapper image-send-msg-button"
              >
                <Button type="primary" shape="circle" @click="handleSend">
                  <template #icon>
                    <ArrowUp />
                  </template>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useTemplateRef } from 'vue'
import ExitSkillButton from './ExitSkillButton.vue'
import ChatEditor from './ChatEditor.vue'
import { Button, Dropdown, Menu, MenuItem } from 'ant-design-vue'
import ArrowUp from './ArrowUp.vue'
const emit = defineEmits(['update:skill', 'send'])
const props = defineProps({
  skill: {
    type: String,
    default: '',
  },
  value: {
    type: Array,
    default: () => [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
  },
  placeholder: {
    type: String,
    default: '描述你所想象的画面，角色，情绪，场景，风格...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
})
const editorRef = useTemplateRef('editorRef')
const skillOptions = ref([
  { label: '图片生成', value: 'picture' },
  { label: '视频生成', value: 'video' },
])
const skillDict = skillOptions.value.reduce((prev, cur) => {
  prev[cur.value] = cur.label
  return prev
}, {})
const chooseSkill = (item) => {
  emit('update:skill', item.value)
  editorRef?.value?.focus()
}
const handleExitSkill = () => {
  emit('update:skill', '')
  editorRef?.value?.focus()
}

const hasSkill = computed(() => props.skill !== '')
const isEmpty = computed(
  () =>
    !props.value.some(
      (block) =>
        block.children &&
        block.children.some((child) => child.text && child.text.trim())
    )
)
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    if (e.shiftKey) {
      // shift+回车,允许换行
    } else {
      e.preventDefault()
      handleSend()
    }
  }
  if (e.ctrlKey && e.key === 'a') {
    event.preventDefault()
    editorRef?.value?.selectAll()
  }
}
const handleSend = () => {
  const content = editorRef?.value?.getContent()
  console.log('Node.string', content)
  if (content) {
    emit('send', content)
    editorRef?.value?.clear()
  }
}
</script>
