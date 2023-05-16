import { v4 as uuidv4 } from 'uuid'

export function generateTemporaryIds(quantity: number) {
  const temporaryIds = []

  for (let i = 0; i < quantity; i++) {
    const uniqueId = uuidv4() // Generate a unique identifier using UUID
    const timestamp = Date.now() // Get the current timestamp in milliseconds

    // Combine the unique identifier and timestamp to create a temporary ID
    const temporaryId = `${uniqueId}-${timestamp}`

    temporaryIds.push(temporaryId)
  }

  return { temporaryIds }
}
