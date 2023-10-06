import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(
  _: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getAuthSession()
    if (!session?.user) return new Response('Unauthorized', { status: 401 })
    const { userId } = params
    if (session.user.id !== userId) {
      return new Response('Forbidden', { status: 403 })
    }
    const checkUser = await db.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!checkUser)
      return new Response('The user account doesn`t exist', { status: 404 })

    await db.user.delete({
      where: {
        id: userId
      }
    })

    //TODO: delete the replies of the user
    //TODO: delete the user account
    //TODO: use prisma transaction

    return new Response('Ok')
  } catch (error) {
    return new Response(
      'Could not delete the resource, please try again later.',
      { status: 500 }
    )
  }
}
