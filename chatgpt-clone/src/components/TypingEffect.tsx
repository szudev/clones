import { TypingEffectProps } from '@/types/props.type'
import useTyping from '@/hooks/useTyping'
import CodeSnippet from './Codesnippet'

export default function TypingEffect({ text }: TypingEffectProps) {
  const { showCursor, displayText } = useTyping({ text })

  return (
    <p
      className={`${
        showCursor ? 'after:content-["▋"] after:ml-1 after:animate-typing' : ''
      }`}
    >
      <CodeSnippet prompt={displayText} />
    </p>
  )
}
