import * as crypto from 'crypto'

export async function hashSHA256(data: string) {
  const hash = crypto.createHash('sha256')
  hash.update(data)
  return hash.digest('hex')
}
