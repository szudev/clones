import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { UserAccountValidator } from '@/lib/validators/account'
import { z } from 'zod'

export async function DELETE(request: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) return new Response('Unauthorized', { status: 401 })
    const { userId } = UserAccountValidator.parse(request)
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

    return new Response('Ok')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid DELETE request data.', { status: 422 })
    }

    return new Response(
      'Could not delete the resource, please try again later.',
      { status: 500 }
    )
  }
}
