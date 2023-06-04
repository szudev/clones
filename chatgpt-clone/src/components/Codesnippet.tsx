import SyntaxHighlighter from 'react-syntax-highlighter'
import { irBlack } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { CheckIcon, CopyCodeIcon } from './Icons'
import { useState } from 'react'

interface ICodeSnippet {
  prompt: string
}

interface IContent {
  type: 'text' | 'code'
  content: string
  language?: string
}

export default function CodeSnippet({ prompt }: ICodeSnippet) {
  const [copiedStatus, setCopiedStatus] = useState<boolean[]>([])
  const regex = /```(\w+)\n([\s\S]*?)```/gs
  const matches = Array.from(prompt.matchAll(regex))
  const contents: IContent[] = []
  let lastIndex = 0

  for (const match of matches) {
    const [, language, content] = match
    const nonCodeText = prompt.substring(lastIndex, match.index)
    if (match.index !== undefined) {
      lastIndex = match.index + match[0].length
    }
    if (nonCodeText) {
      contents.push({
        type: 'text',
        content: nonCodeText
      })
    }
    contents.push({ type: 'code', content, language })
  }

  const remainingText = prompt.substring(lastIndex)
  if (remainingText) {
    contents.push({ type: 'text', content: remainingText })
  }

  const handleCopyButtonOnClick = (prompt: string, index: number) => {
    navigator.clipboard.writeText(prompt)
    setCopiedStatus((prevState) => {
      const newArray = [...prevState]
      newArray[index] = !newArray[index]
      return newArray
    })
    const timeoutId = setTimeout(() => {
      setCopiedStatus((prevState) => {
        const newArray = [...prevState]
        newArray[index] = !newArray[index]
        return newArray
      })
    }, 2000)

    return () => clearTimeout(timeoutId)
  }

  return (
    <>
      {contents.map(({ type, content, language }, index) =>
        type === 'text' ? (
          <div key={index}>{content}</div>
        ) : (
          <div className='overflow-x-auto w-full' key={index}>
            <div className='flex w-full items-center relative text-gray-200 bg-gptgray p-4 text-xs font-sans justify-between rounded-t-md'>
              <strong className='text-white'>{language}</strong>
              {copiedStatus[index] ? (
                <button disabled className='flex ml-auto gap-2'>
                  <CheckIcon />
                  Copied!
                </button>
              ) : (
                <button
                  className='flex ml-auto gap-2'
                  onClick={() => handleCopyButtonOnClick(content, index)}
                >
                  <CopyCodeIcon />
                  Copy code
                </button>
              )}
            </div>
            <SyntaxHighlighter
              language={language}
              style={irBlack}
              customStyle={{
                padding: '1rem',
                overflowX: 'auto'
              }}
              className='rounded-b-md overflow-x-auto'
            >
              {content}
            </SyntaxHighlighter>
          </div>
        )
      )}
    </>
  )
}
