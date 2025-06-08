
import { LinearClient } from '@linear/sdk'
import dotenv from 'dotenv'

dotenv.config()

export const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY
})
