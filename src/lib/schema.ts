import { z } from 'zod'

export const IntentSchema = z.object({
  intent: z.object({
    topics: z.array(z.string()),
    offer_type: z.array(z.string()),
    category: z.array(z.string()),
    time: z.string().nullable(),
  }),
  expandedQueries: z.array(z.string()),
})

export type Intent = z.infer<typeof IntentSchema>

export const videoSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    channel: z.string(),
    publishedAt: z.string(),
    views: z.string(),
    duration: z.string(),
    sponsor: z.string(),
    offerType: z.string(),
    offerLabel: z.string(),
    offerDescription: z.string(),
    discountCodeFromDescription: z.string(),
    videoUrl: z.string(),
  })
)

export type Video = z.infer<typeof videoSchema>

export const readVideoDataSchema = z.object({
  discountCodes: z.array(
    z.object({
      code: z.string(),
      description: z.string(),
      sponsorUrl: z.string(),
    })
  ),
  discountCodesRevealTimeframe: z.string(),
})

export const videoDataSchema = z.object({
  video: videoSchema,
  videoData: readVideoDataSchema,
})

export type ReadVideoData = z.infer<typeof readVideoDataSchema>
