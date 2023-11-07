import {
  Comment,
  CommentReply,
  Post,
  ReplyVote,
  Subreddit,
  User,
  Vote
} from '@prisma/client'

export type ExtendedPost = Post & {
  subreddit: Subreddit
  votes: Vote[]
  author: User
  comments: Comment[]
}

export type ExtendedReply = CommentReply & {
  author: User
  votes: ReplyVote[]
}

export type ExtendedSubreddit = Subreddit & {
  creator: User | null
  _count: {
    posts: number
    subscribers: number
  }
}
