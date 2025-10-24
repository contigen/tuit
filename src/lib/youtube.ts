import type { youtube_v3 } from '@googleapis/youtube'

const API_KEY = process.env.YOUTUBE_API_KEY

const BASE_URL = 'https://www.googleapis.com/youtube/v3'

type YouTubeSearchResponse = youtube_v3.Schema$SearchListResponse
type YouTubeVideoDetailsResponse = youtube_v3.Schema$VideoListResponse

export async function searchYouTube(query: string) {
  if (!API_KEY) throw new Error('YouTube API key is not set')
  const maxResults = 20
  const url = new URL(`${BASE_URL}/search`)
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('q', query)
  url.searchParams.set('type', 'video')
  url.searchParams.set('maxResults', String(maxResults))
  url.searchParams.set('key', API_KEY)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json()
    console.error('YouTube API error', err)
    throw new Error(err.error.message)
  }

  const data: YouTubeSearchResponse | undefined = await res.json()
  const ids = data?.items
    ?.map(item => item.id?.videoId)
    .filter((id): id is string => typeof id === 'string')
  if (!ids?.length) return []
  return ids
}

export async function getVideoDetails(ids: string[]) {
  if (!API_KEY) throw new Error('YouTube API key is not set')
  const url = new URL(`${BASE_URL}/videos`)
  url.searchParams.set(
    'part',
    'snippet,contentDetails,statistics,paidProductPlacementDetails,status '
  )
  url.searchParams.set('id', ids.join())
  url.searchParams.set('key', API_KEY)
  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json()
    console.error('YouTube API error', JSON.stringify(err))
    throw new Error(err.error.message)
  }

  const data: YouTubeVideoDetailsResponse | undefined = await res.json()
  return data?.items?.map(item => ({
    id: item.id,
    title: item.snippet?.title,
    description: item.snippet?.description,
    channel: item.snippet?.channelTitle,
    tags: item.snippet?.tags,
    publishedAt: item.snippet?.publishedAt,
    thumbnail:
      item.snippet?.thumbnails?.maxres?.url ||
      item.snippet?.thumbnails?.standard?.url,
    duration: item.contentDetails?.duration,
    views: item.statistics?.viewCount,
    hasPaidProductPlacement:
      item.paidProductPlacementDetails?.hasPaidProductPlacement,
    videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
  }))
}
