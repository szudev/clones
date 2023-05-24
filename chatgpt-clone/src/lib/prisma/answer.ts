import prisma from '.'

interface ICreateAnswerProps {
  answer: string
  messageId: string
}

export async function createAnswer({ answer, messageId }: ICreateAnswerProps) {
  const newAnswer = await prisma.answer.create({
    data: {
      answer,
      message: {
        connect: {
          id: messageId
        }
      }
    },
    select: {
      id: true,
      answer: true,
      message: {
        select: {
          chatId: true
        }
      }
    }
  })

  return { newAnswer }
}
