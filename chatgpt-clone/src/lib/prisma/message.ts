import prisma from '.'

interface IGetMessagesByChatIdProps {
  chatId: string
}

interface ICreateMessagePromptProps extends IGetMessagesByChatIdProps {
  prompt: string
}

interface IGetMessageById {
  messageId: string
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
  prompt
}: ICreateMessagePromptProps) {
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

export async function getMessageById({ messageId }: IGetMessageById) {
  const message = await prisma.message.findUnique({
    where: {
      id: messageId
    },
    select: {
      id: true,
      message: true,
      answer: true,
      chatId: true
    }
  })

  return { message }
}
