<template>
  <Slate
    :editor="editor"
    @change="handleChange"
    :renderElement="renderElement"
    :renderLeaf="renderLeaf"
  >
    <Editable
      class="container-wMk8bg editor-u_GcDR p-0 editor-_J1VG_"
      :placeholder="props.placeholder"
      :autoFocus="props.autoFocus"
      :readOnly="props.disabled"
      @keydown="handleKeyDown"
      style="
        position: relative;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        min-height: 28px;
      "
    />
  </Slate>
</template>
<script setup lang="jsx">
import { useSlots, nextTick, h, toRaw } from 'vue'
import { Slate, Editable, useInheritRef } from 'slate-vue3'
import { createEditor, Transforms, Range, Editor, Node } from 'slate-vue3/core'
import { DOMEditor, withDOM } from 'slate-vue3/dom'
import { withHistory } from 'slate-vue3/history'

const emit = defineEmits(['change', 'keydown'])
const slots = useSlots()
const props = defineProps({
  value: {
    type: Array,
    default: () => [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
  },
  hasPrefix: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
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

const editor = withHistory(withDOM(createEditor()))
editor.children = props.value

defineExpose({
  focus: () => {
    DOMEditor.focus(editor)
  },
  focusEnd: () => {
    Transforms.select(editor, Editor.end(editor, []))
    nextTick(() => {
      DOMEditor.focus(editor)
    })
  },
  clear: () => {
    Transforms.delete(editor, {
      at: {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      },
    })
  },
  selectAll: () => {
    Transforms.select(editor, {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    })
  },
  getContent: () => {
    return editor.children.map((item) => Node.string(item)).join('\n')
  },
  setContent: (text) => {
    Transforms.insertText(editor, text, { at: [] })
  },
})

function handleKeyDown(event) {
  if (editor.selection && Range.isCollapsed(editor.selection)) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      Transforms.move(editor, { unit: 'offset', reverse: true })
      return
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      Transforms.move(editor, { unit: 'offset' })
      return
    }
  }

  emit('keydown', event)
}
function handleChange(newValue) {
  emit('change', newValue)
}

const isParagraphElement = (element) => {
  return element && element.type === 'paragraph'
}
const getFirstElement = (value) => {
  return toRaw(value[0]) || null
}

const renderElement = (RenderElementProps) => {
  const { attributes, children, element } = RenderElementProps
  const el = toRaw(element)
  if (isParagraphElement(el)) {
    const isFirstParagraph = getFirstElement(props.value) === el
    const shouldShowPrefix = props.hasPrefix && isFirstParagraph
    return (
      <div {...useInheritRef(attributes)} class="paragraph-Txfg2n">
        {shouldShowPrefix && (
          <div class="prefix-ohUypf" contentEditable={false}>
            {slots.prefix?.()}
          </div>
        )}
        {children}
      </div>
    )
  }
  return <div {...useInheritRef(attributes)}>{children}</div>
}
const renderLeaf = (RenderLeafProps) => {
  const { attributes, children, leaf } = RenderLeafProps
  return h(
    'span',
    { ...attributes, style: { paddingLeft: leaf.text === '' ? '0.1px' : '' } },
    children
  )
}
</script>
