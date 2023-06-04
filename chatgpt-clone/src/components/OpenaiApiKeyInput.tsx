import { useOpenAiKeyStore } from '@/store/openAIKey'
import { TrashIcon, CheckIcon, CancelIcon } from './Icons'
import { MutableRefObject, useRef, useState } from 'react'

export default function OpenaiApiKeyInput() {
  const { setKey, keySetted, clearKey } = useOpenAiKeyStore((state) => state)
  const [openaiApiKeyInput, setOpenaiApiKeyInput] = useState(false)
  const [isOpenaiApiyKeyInputEmpty, setIsOpenaiApyKeyinputEmpty] =
    useState(true)
  const [openaiKeySetted, setOpenAiKeySetted] = useState(false)
  const openaikeyInputRef = useRef() as MutableRefObject<HTMLInputElement>

  const handleOpenaiApiKeyInputClick = () => {
    setOpenaiApiKeyInput((prevState) => !prevState)
    setIsOpenaiApyKeyinputEmpty(true)
  }

  const handleOnChangeOpenaiKey = () => {
    const { value } = openaikeyInputRef.current
    setIsOpenaiApyKeyinputEmpty(value.trim() === '')
  }

  const handleSetOpenaiKey = () => {
    const { value } = openaikeyInputRef.current
    if (value === '') return
    setOpenAiKeySetted((prevState) => !prevState)
    const timeoutId = setTimeout(() => {
      setOpenAiKeySetted((prevState) => !prevState)
      setKey(value.trim())
      setOpenaiApiKeyInput((prevState) => !prevState)
    }, 2000)

    return () => clearTimeout(timeoutId)
  }

  const handleClearOpenaiKeyClick = () => {
    clearKey()
  }

  return (
    <>
      {keySetted && (
        <div className='flex justify-between py-3 px-3 items-center gap-3 rounded-md text-white text-sm'>
          <strong className='text-green-500 animate-pulse font-extrabold'>
            API key ready
          </strong>
          <button
            onClick={handleClearOpenaiKeyClick}
            className='hover:bg-gray-900 hover:text-gray-400 text-white p-1 rounded-md'
          >
            <TrashIcon />
          </button>
        </div>
      )}
      {!keySetted && (
        <>
          {!openaiApiKeyInput ? (
            <div
              onClick={handleOpenaiApiKeyInputClick}
              className='flex py-3 px-3 animate-pulse items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
            >
              {!openaiApiKeyInput && (
                <strong className='text-red-600 font-extrabold'>
                  Enter your OpenAI API key
                </strong>
              )}
            </div>
          ) : (
            <div className='flex py-2 px-2 items-center gap-3 rounded-md text-white text-sm'>
              <div className='flex w-full text-white border rounded-md shadow-lg bg-gptlightgray border-gray-900/50'>
                {openaiKeySetted && (
                  <strong className='flex gap-1 rounded-md bg-gptdarkgray border border-green-500 items-center justify-end w-full p-2 text-green-500'>
                    <CheckIcon />
                    <span>Applied!</span>
                  </strong>
                )}
                {!openaiKeySetted && (
                  <>
                    <input
                      placeholder='Place your key here'
                      className='bg-transparent p-2 w-full outline-none'
                      autoFocus
                      ref={openaikeyInputRef}
                      onChange={handleOnChangeOpenaiKey}
                    />
                    <button
                      onClick={handleSetOpenaiKey}
                      disabled={isOpenaiApiyKeyInputEmpty}
                      className='disabled:opacity-40 enabled:hover:bg-gray-900 enabled:hover:text-gray-400 disabled:hover:bg-transparent text-white p-1 rounded-md'
                    >
                      <CheckIcon />
                    </button>
                    <button
                      onClick={handleOpenaiApiKeyInputClick}
                      className='disabled:opacity-40 enabled:hover:bg-gray-900 enabled:hover:text-gray-400 disabled:hover:bg-transparent text-white p-1 rounded-md'
                    >
                      <CancelIcon />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
