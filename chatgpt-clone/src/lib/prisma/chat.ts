import prisma from '.'

type EmailProp = {
  email: string
}

export async function createNewChat({ email }: EmailProp) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (user) {
      const chat = await prisma.chat.create({
        data: {
          messages: {
            create: []
          },
          user: {
            connect: {
              id: user.id
            }
          }
        },
        include: {
          messages: true,
          user: true
        }
      })

      return { chat }
    } else {
      const newUser = await prisma.user.create({
        data: {
          email: email,
          chats: {
            create: [
              {
                messages: {
                  create: []
                }
              }
            ]
          }
        },
        include: {
          chats: {
            include: {
              messages: true
            }
          }
        }
      })

      return { chat: newUser.chats[0] }
    }
  } catch (error) {
    return { error }
  }
}

export async function getChats({ email }: EmailProp) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (!user) return { chats: [] }
    const chats = await prisma.chat.findMany({
      where: {
        userId: user?.id
      },
      select: {
        id: true,
        title: true,
        messages: true
      }
    })

    return { chats }
  } catch (error) {
    throw error
  }
}
