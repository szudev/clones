import { getAuthSession } from '@/lib/auth'
import { Post, Vote, VoteType } from '@prisma/client'
import { notFound } from 'next/navigation'
import PostVoteClient from './PostVoteClient'

interface Props {
  postId: string
  initialVotesAmount?: number
  initialVote?: VoteType | null
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>
}

export default async function PostVoteServer({
  getData,
  postId,
  initialVote,
  initialVotesAmount
}: Props) {
  const session = await getAuthSession()

  let votesAmount: number = 0
  let currentVote: VoteType | null | undefined = undefined

  if (getData) {
    const post = await getData()
    if (!post) return notFound()

    votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'DOWN') return acc - 1
      return acc
    }, 0)

    currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id
    )?.type
  } else {
    votesAmount = initialVotesAmount!
    currentVote = initialVote
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVote={currentVote}
      initialVotesAmount={votesAmount}
    />
  )
}
