import prisma from '.'

interface IGetMessagesByChatIdProps {
  chatId: string
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
