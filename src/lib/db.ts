import { Redis } from '@upstash/redis'

export const db = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '', // Provide a default value if undefined
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '', // Provide a default value if undefined
  });