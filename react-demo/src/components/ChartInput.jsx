import {
  forwardRef,
  useMemo,
  useRef,
  useCallback,
  useState,
  useImperativeHandle
} from 'react'
import { createEditor, Transforms, Range, Editor } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'
import { Tooltip, Button } from '@douyinfe/semi-ui'
import classNames from 'classnames'

const EditorBlockType = {
  Text: 'Text',
  Select: 'Select',
  Placeholder: 'Placeholder'
}

const isParagraphElement = (element) => {
  return element && element.type === 'paragraph'
}

const getFirstElement = (value) => {
  return value[0] || null
}

const LabeledWrapper = forwardRef(
  (
    {
      children,
      className,
      hoverable = false,
      contentEditable,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <span
        {...props}
        className={classNames('container-X3mSoV', className, {
          'hoverable-Trkk4u': hoverable
        })}
        ref={ref}
        contentEditable={contentEditable}
        onClick={onClick}
        suppressContentEditableWarning={true}
      >
        {children}
      </span>
    )
  }
)

const ExitSkillButton = ({
  onClose,
  skillName = '图像生成',
  theme = 'borderless'
}) => {
  const handleClick = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      onClose?.()
    },
    [onClose]
  )

  return (
    <Tooltip content="退出技能" position="top" showArrow trigger="hover">
      <LabeledWrapper
        data-testid="skill_input_exit_button"
        className={classNames('exit-skill-button-SKn9lH', {
          'borderless-yNFhuy': theme === 'borderless'
        })}
        contentEditable={false}
        onClick={handleClick}
        tabIndex={0}
      >
        <div className="flex items-center s-font-base-em text-s-color-brand-primary-default select-none">
          {skillName}
        </div>

        {theme === 'borderless' && (
          <span
            role="img"
            className="semi-icon semi-icon-default delete-icon-K8MZrV"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M1 12c0 6.075 4.925 11 11 11s11-4.925 11-11S18.075 1 12 1 1 5.925 1 12m9.586 0L7.465 8.878a1 1 0 0 1 1.414-1.414L12 10.586l3.121-3.122a1 1 0 1 1 1.415 1.414L13.414 12l3.122 3.121a1 1 0 0 1-1.415 1.414l-3.12-3.121-3.122 3.121a1 1 0 1 1-1.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </LabeledWrapper>
    </Tooltip>
  )
}

const FlowChatEditor = forwardRef(
  (
    {
      initialValue,
      value = initialValue,
      placeholder = '描述你所想象的画面，角色，情绪，场景，风格...',
      disabled = false,
      autoFocus = false,
      onKeyDown,
      onChange,
      onClickInput,
      prefix
    },
    ref
  ) => {
    const editorRef = useRef(null)

    const editor = useMemo(() => {
      const baseEditor = withHistory(withReact(createEditor()))

      const { isInline, isVoid } = baseEditor

      // baseEditor.isInline = (element) =>
      //   (element &&
      //     (element.type === 'labeled_input' ||
      //       element.type === 'labeled_select' ||
      //       element.type === EditorBlockType.Select)) ||
      //   isInline(element)

      // baseEditor.isVoid = (element) =>
      //   (element &&
      //     (element.type === 'labeled_select' ||
      //       element.type === EditorBlockType.Select)) ||
      //   isVoid(element)

      return baseEditor
    }, [])

    useImperativeHandle(ref, () => editor, [editor])

    const defaultValue = [
      {
        type: 'paragraph',
        children: [{ text: '' }]
      }
    ]

    const handleKeyDown = useCallback(
      (event) => {
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            Transforms.move(editor, { unit: 'offset', reverse: true })
          } else if (event.key === 'ArrowRight') {
            event.preventDefault()
            Transforms.move(editor, { unit: 'offset' })
          }
        }

        onKeyDown?.(event)
      },
      [editor, onKeyDown]
    )

    const renderElement = useCallback(
      (props) => {
        const { attributes, children, element } = props

        if (isParagraphElement(element)) {
          const isFirstParagraph =
            getFirstElement(value || defaultValue) === element
          const shouldShowPrefix = prefix && isFirstParagraph

          return (
            <div {...attributes} className="paragraph-Txfg2n">
              {shouldShowPrefix && (
                <div className="prefix-ohUypf" contentEditable={false}>
                  {prefix}
                </div>
              )}
              {children}
            </div>
          )
        }
        return (
          <div {...attributes} className="paragraph-Txfg2n">
            {children}
          </div>
        )
      },
      [disabled, onClickInput, editor, prefix, value, defaultValue]
    )

    return (
      <Slate
        editor={editor}
        initialValue={value || defaultValue}
        onChange={(newValue) => {
          onChange?.(newValue)
        }}
      >
        <Editable
          className="container-wMk8bg editor-u_GcDR p-0 editor-_J1VG_"
          ref={editorRef}
          renderElement={renderElement}
          placeholder={placeholder}
          autoFocus={autoFocus}
          readOnly={disabled}
          onKeyDown={handleKeyDown}
          style={{
            position: 'relative',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            minHeight: '28px'
          }}
        />
      </Slate>
    )
  }
)

const ImageGenerationInputComponent = ({
  onClose,
  onSend,
  onBreak,
  showTools = true,
  hasContent = false,
  showBreakButton = false,
  ...editorProps
}) => {
  const [editorState, setEditorState] = useState({ data: [] })

  const editorRef = useRef(null)

  return (
    <div className="container-QrxCka">
      <div className="custom-area-wrapper-e6UKsv">
        <div className="placeholder-Kgrpqi"></div>
      </div>

      <div
        className="editor-container-yj5w_H"
        data-testid="skill-modal-image-creation"
      >
        <div className="editor-wrapper-AdiwSu">
          <div className="editor-u_GcDR flex items-start w-full">
            {hasContent && <ExitSkillButton onClose={onClose} />}

            <FlowChatEditor
              {...editorProps}
              prefix={
                !hasContent ? <ExitSkillButton onClose={onClose} /> : null
              }
              ref={editorRef}
            />
          </div>
        </div>

        {showTools && (
          <div className="bottom-wrapper-PqK2vl">
            <div className="left-tools-wrapper-INTHKl">
              <div className="bp5-overflow-list overflow-list-NyrGXN">
                <div className="bp5-overflow-list-spacer"></div>
              </div>
            </div>

            <div className="tools-placeholder-QV9wFb"></div>

            <div className="right-tools-wrapper-HlP9ga">
              <div className="container-T4Zbge">
                <div className="right-area-zo66jb">
                  <div
                    className={classNames('container-HayrIA break-btn-Rv8NnA', {
                      hidden: !showBreakButton
                    })}
                    data-testid="chat_input_local_break_button"
                    tabIndex={0}
                    onClick={onBreak}
                  >
                    <span
                      role="img"
                      className="semi-icon semi-icon-default icon-ue0CiT"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11m0-20a9 9 0 1 1 0 18 9 9 0 0 1 0-18m-2 5.5A1.5 1.5 0 0 0 8.5 10v4a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 14 8.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>

                  <div className="container-LQV0KD send-btn-wrapper image-send-msg-button">
                    <Button
                      theme="solid"
                      type="primary"
                      size="default"
                      disabled={!editorProps.value?.length}
                      onClick={onSend}
                      data-testid="chat_input_send_button"
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="m3.543 8.883 7.042-7.047a2 2 0 0 1 2.828 0l7.043 7.046a1 1 0 0 1 0 1.415l-.701.701a1 1 0 0 1-1.414 0L13.3 5.956v15.792a1 1 0 0 1-1 1h-.99a1 1 0 0 1-1-1V6.342l-4.654 4.656a1 1 0 0 1-1.414 0l-.7-.7a1 1 0 0 1 0-1.415"
                          />
                        </svg>
                      }
                      className="send-btn-gNkciw"
                      style={{
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        padding: '0',
                        minWidth: '36px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGenerationInputComponent
