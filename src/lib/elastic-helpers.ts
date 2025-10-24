import { VideoDocument } from './elastic-types'

export function mapToVideoDocument(
  youtubeData: {
    id?: string
    title?: string
    description?: string
    thumbnail?: string
    channel?: string
    publishedAt?: string
    views?: string
    duration?: string
    tags?: string[]
    hasPaidProductPlacement?: boolean
    videoUrl?: string
  },
  enrichedData?: {
    sponsor?: string
    offerType?: string
    offerLabel?: string
    offerDescription?: string
    discountCode?: string
    discountCodes?: Array<{
      code: string
      description: string
      sponsorUrl: string
    }>
    discountCodeFromDescription?: string
    discountCodesRevealTimeframe?: string
  },
  embedding?: number[]
): VideoDocument {
  return {
    id: youtubeData.id || '',
    title: youtubeData.title || '',
    description: youtubeData.description || '',
    thumbnail: youtubeData.thumbnail || '',
    channel: youtubeData.channel || '',
    publishedAt: youtubeData.publishedAt || new Date().toISOString(),
    views: youtubeData.views || '0',
    duration: youtubeData.duration || '',
    tags: youtubeData.tags,
    hasPaidProductPlacement: youtubeData.hasPaidProductPlacement,
    sponsor: enrichedData?.sponsor,
    offerType: enrichedData?.offerType,
    offerLabel: enrichedData?.offerLabel,
    offerDescription: enrichedData?.offerDescription,
    discountCodes: enrichedData?.discountCodes,
    discountCodeFromDescription: enrichedData?.discountCodeFromDescription,
    discountCodesRevealTimeframe: enrichedData?.discountCodesRevealTimeframe,
    videoUrl: youtubeData.videoUrl || '',
    embedding,
  }
}
