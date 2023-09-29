import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { UserNameValidator } from '@/lib/validators/username'
import { z } from 'zod'

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) return new Response('Unauthorized', { status: 401 })
    const body = await request.json()
    const { username } = UserNameValidator.parse(body)
    const checkDuplicatedUserName = await db.user.findFirst({
      where: {
        username
      }
    })
    if (checkDuplicatedUserName) {
      return new Response('The username is already in use.', { status: 409 })
    }

    await db.user.update({
      where: {
        id: session.user.id
      },
      data: {
        username
      }
    })

    return new Response('Ok')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid PATCH request data.', { status: 422 })
    }

    return new Response(
      'Could not update the resource, please try again later.',
      { status: 500 }
    )
  }
}
