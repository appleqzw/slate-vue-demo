import { useState } from 'react'
import ChartInput from './ChartInput'
import { Node } from 'slate'
import '@douyinfe/semi-ui/dist/css/semi.css'
import './style.css'

const Demo = () => {
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }]
    }
  ])
  const isEmpty = !value.some(
    (block) =>
      block.children &&
      block.children.some((child) => child.text && child.text.trim())
  )

  const handleSend = () => {
    const textContent = value
      .map((node) => Node.string(node))
      .join('\n')
      .trim()

    if (textContent) {
      console.log(textContent)
      // Reset editor
      setValue([
        {
          type: 'paragraph',
          children: [{ text: '' }]
        }
      ])
    }
  }

  return (
    <div
      style={{
        padding: '20px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#f6f8fa',
        minHeight: '100vh'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}
        >
          <ChartInput
            value={value}
            hasContent={isEmpty}
            onChange={setValue}
            placeholder="描述你所想象的画面，角色，情绪，场景，风格..."
            onSend={handleSend}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault()
                handleSend()
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Demo
