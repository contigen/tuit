export type DiscountCode = {
  code: string
  description: string
  sponsorUrl: string
}

export type VideoDocument = {
  id: string
  title: string
  description: string
  thumbnail: string
  channel: string
  publishedAt: string
  views: string
  duration: string
  tags?: string[]
  hasPaidProductPlacement?: boolean
  sponsor?: string
  offerType?: string
  offerLabel?: string
  offerDescription?: string
  discountCodes?: DiscountCode[]
  discountCodeFromDescription?: string
  discountCodesRevealTimeframe?: string
  videoUrl: string
  embedding?: number[]
  created_at?: string
}

export type IntentDocument = {
  intent_id?: string
  topics?: string[]
  offer_type?: string[]
  category?: string[]
  time?: string | null
  expandedQueries?: string[]
  embedding?: number[]
  video_ids?: string[]
  created_at?: string
}

export type SearchResult = {
  source: string
  id: string
  title: string
  description: string
  thumbnail: string
  channel: string
  publishedAt: string
  views: string
  duration: string
  sponsor?: string
  offerType?: string
  offerLabel?: string
  offerDescription?: string
  discountCodes?: DiscountCode[]
  videoUrl: string
}
