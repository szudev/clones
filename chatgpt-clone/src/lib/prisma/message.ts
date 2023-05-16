import prisma from '.'

interface IGetMessagesByChatIdProps {
  chatId: string
}

interface ICreateMessagePromptProps extends IGetMessagesByChatIdProps {
  prompt: string
  answer: string | null
}

export async function getMessagesByChatId({
  chatId
}: IGetMessagesByChatIdProps) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId
      },
      select: {
        id: true,
        message: true,
        answer: {
          select: {
            id: true,
            answer: true
          }
        }
      }
    })
    return { messages }
  } catch (error) {
    throw error
  }
}

export async function createMessagePrompt({
  chatId,
  prompt,
  answer
}: ICreateMessagePromptProps) {
  if (answer) {
    const newMessage = await prisma.message.create({
      data: {
        message: prompt,
        answer: {
          create: {
            answer
          }
        },
        chat: {
          connect: {
            id: chatId
          }
        }
      },
      select: {
        id: true,
        message: true,
        answer: {
          select: {
            id: true,
            answer: true
          }
        }
      }
    })

    return { newMessage }
  } else {
    const newMessage = await prisma.message.create({
      data: {
        message: prompt,
        chat: {
          connect: {
            id: chatId
          }
        }
      },
      select: {
        id: true,
        message: true,
        answer: true
      }
    })

    return { newMessage }
  }
}
