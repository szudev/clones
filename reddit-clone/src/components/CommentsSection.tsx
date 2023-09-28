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
      postId,
      replyToId: null
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true
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
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmount = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === 'UP') return acc + 1
                if (vote.type === 'DOWN') return acc - 1
                return acc
              },
              0
            )

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id
            )
            return (
              <article key={topLevelComment.id} className='flex flex-col'>
                <div className='mb-2'>
                  <PostComment comment={topLevelComment} />
                </div>
              </article>
            )
          })}
      </div>
    </section>
  )
}
