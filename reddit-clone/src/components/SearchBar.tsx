'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/Command'
import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Prisma, Subreddit } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2, Users } from 'lucide-react'
import debounce from 'lodash.debounce'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'

export default function SearchBar() {
  const [input, SetInput] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const router = useRouter()
  const commandRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const {
    data: queryResults,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['search-query'],
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType
      })[]
    },
    enabled: false
  })

  const searchRequest = debounce(() => {
    refetch()
    setIsTyping(false)
  }, 500)

  const debounceSearchRequests = useCallback(() => {
    searchRequest()
    setIsTyping(true)
  }, [])

  useOnClickOutside(commandRef, () => {
    SetInput('')
    setIsTyping(false)
  })

  useEffect(() => {
    SetInput('')
    setIsTyping(false)
  }, [pathname])

  return (
    <Command
      ref={commandRef}
      className='relative rounded-lg border max-w-lg z-50 overflow-visible'
    >
      <CommandInput
        value={input}
        onValueChange={(text) => {
          SetInput(text)
          debounceSearchRequests()
        }}
        className='outline-none border-none focus:border-none focus:outline-none ring-0'
        placeholder='Search communities...'
      />
      {input.length > 0 ? (
        <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-b-lg'>
          {isRefetching || isTyping ? (
            <CommandEmpty>
              <div className='flex justify-center'>
                <Loader2 className='w-5 h-5 animate-spin' />
              </div>
            </CommandEmpty>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading='Subreddits'>
              {queryResults?.map((subreddit) => (
                <CommandItem
                  key={subreddit.id}
                  onSelect={(e) => {
                    router.push(`/r/${e}`)
                    router.refresh()
                  }}
                  value={subreddit.name}
                >
                  <Users className='mr-2 h-4 w-4' />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  )
}
