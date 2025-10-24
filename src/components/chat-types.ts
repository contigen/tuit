import type React from 'react'

export type Message = {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  components?: React.ReactNode[]
}

export type Video = {
  id?: number | string
  thumbnail: string
  title: string
  description?: string
  channel: string
  views: string
  publishedAt: string
  duration: string
  sponsor: string
  offerType: string
  offerLabel: string
  offerDescription: string
  discountCodeFromDescription?: string
  discountCodes?: Array<{
    code: string
    description: string
    sponsorUrl: string
  }>
  discountCodesRevealTimeframe?: string
  videoUrl?: string
  relevance?: number
}
