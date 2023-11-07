import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import PostComment from './PostComment'
import CreateComment from './CreateComment'

interface Props {
  postId: string
}

export default async function CommentsSection({ postId }: Props) {
  const session = await getAuthSession()
  const comments = await db.comment.findMany({
    where: {
      postId
    },
    include: {
      author: true,
      votes: true,
      _count: {
        select: {
          replies: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <section className='flex flex-col gap-y-4 mt-4 border-t border-t-gray-500'>
      <CreateComment postId={postId} />
      <div className='flex flex-col gap-y-6 mt-4'>
        {comments.map((comment) => {
          const commentVotesAmount = comment.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1
            if (vote.type === 'DOWN') return acc - 1
            return acc
          }, 0)

          const commentVote = comment.votes.find(
            (vote) => vote.userId === session?.user.id
          )

          const repliesAmount = comment._count.replies

          return (
            <article key={comment.id} className='flex flex-col'>
              <div>
                <PostComment
                  comment={comment}
                  votesAmount={commentVotesAmount}
                  currentVote={commentVote}
                  repliesAmount={repliesAmount}
                  session={session}
                />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
