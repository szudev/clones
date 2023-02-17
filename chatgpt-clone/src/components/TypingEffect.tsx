import { TypingEffectProps } from '@/types/props.type'
import useTyping from '@/hooks/useTyping'

export default function TypingEffect({ text }: TypingEffectProps) {
  const { showCursor, displayText } = useTyping({ text })

  return (
    <p
      className={`${
        showCursor ? 'after:content-["▋"] after:ml-1 after:animate-typing' : ''
      }`}
    >
      {displayText}
    </p>
  )
}
