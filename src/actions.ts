'use server'

import { google } from '@ai-sdk/google'
import { embed, embedMany, generateObject } from 'ai'
import { SYSTEM_INSTRUCTION, VIDEO_IDS_REQ_LIMIT } from './app/constant'
import {
  IntentSchema,
  readVideoDataSchema,
  videoSchema,
  type Intent,
} from './lib/schema'
import { getVideoDetails, searchYouTube } from './lib/youtube'
import { cookies } from 'next/headers'
import { searchElastic, searchElasticWithVector } from './lib/elastic'
import { indexVideoData, indexIntent, bulkIndexVideos } from '@/lib/elastic'
import { IntentDocument, VideoDocument } from './lib/elastic-types'
import { mapToVideoDocument } from './lib/elastic-helpers'

type VideoData = {
  id?: string | null
  title?: string | null
  description?: string | null
  thumbnail?: string | null
  channel?: string | null
  publishedAt?: string | null
  views?: string | null
  duration?: string | null
  sponsor?: string
  offerType?: string
  offerLabel?: string
  offerDescription?: string
  videoUrl?: string
  tags?: string[] | null
  hasPaidProductPlacement?: boolean | null
  discountCodes?: Array<{
    code: string
    description: string
    sponsorUrl: string
  }>
  discountCodeFromDescription?: string
  discountCodesRevealTimeframe?: string
}

export type ExpandIntentState = {
  message: 'missing_input' | 'success' | 'error' | 'missing_ids' | ''
  data?: VideoData[] | Record<string, unknown>
}

export async function expandIntent(
  _: ExpandIntentState,
  formData: FormData
): Promise<ExpandIntentState> {
  const input = formData.get('input')?.toString()
  if (!input) return { message: 'missing_input' }
  try {
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_INSTRUCTION,
      prompt: input,
      schema: IntentSchema,
    })

    console.log('Extracted intent:', object.intent)
    console.log('Expanded queries:', object.expandedQueries)

    await storeExpandedQueries(object.expandedQueries)

    console.log('Searching Elasticsearch first...')
    const elasticResults = await searchElasticWithExpandedQueries(
      object.expandedQueries,
      input
    )

    if (elasticResults.length >= 5) {
      console.log(
        `Found ${elasticResults.length} results in Elasticsearch, skipping YouTube`
      )

      const videoIds = elasticResults
        .map(v => v.id)
        .filter((id): id is string => Boolean(id))
      storeUserIntent(object, videoIds).catch(err =>
        console.error('Failed to store intent:', err)
      )

      return { message: 'success', data: elasticResults }
    }

    console.log(
      `Only found ${elasticResults.length} results in Elasticsearch, searching YouTube...`
    )
    const results = await Promise.allSettled(
      object.expandedQueries.map(query => searchYouTubeAction(query))
    )

    const fulfilled = results
      .filter(
        (r): r is PromiseFulfilledResult<string[]> => r.status === 'fulfilled'
      )
      .flatMap(r => r.value)
    console.log('search results', fulfilled.length)

    const ids = fulfilled
    if (!ids.length) return { message: 'missing_ids' }
    if (ids.length > VIDEO_IDS_REQ_LIMIT) {
      const totalIdBatches: string[][] = []
      for (let i = 0; i < ids.length; i += VIDEO_IDS_REQ_LIMIT) {
        totalIdBatches.push(ids.slice(i, i + VIDEO_IDS_REQ_LIMIT))
      }
      const results = await Promise.allSettled(
        totalIdBatches.map(batch => getVideoDetails(batch))
      )
      const videoDetails = results
        .filter(
          (
            r
          ): r is PromiseFulfilledResult<
            Awaited<ReturnType<typeof getVideoDetails>>
          > => r.status === 'fulfilled'
        )
        .flatMap(r => r.value || [])
      if (!videoDetails.length) return { message: 'missing_ids' }
      const videosWithSponsorships = videoDetails.filter(
        video => video.hasPaidProductPlacement
      )
      console.log('video details', videosWithSponsorships)
      const filteredVideoData = await filterVideoData(
        JSON.stringify(videosWithSponsorships),
        input
      )
      console.log('filtered video data', filteredVideoData)

      indexVideosToElastic(
        filteredVideoData,
        object,
        videosWithSponsorships
      ).catch(err => console.error('Failed to index to Elasticsearch:', err))

      const combinedResults = [...elasticResults, ...filteredVideoData]
      console.log(
        `Total results: ${combinedResults.length} (${elasticResults.length} from ES + ${filteredVideoData.length} new)`
      )
      return { message: 'success', data: combinedResults }
    }
    const details = await getVideoDetails(ids)
    const videosWithSponsorships = details?.filter(
      video => video.hasPaidProductPlacement
    )
    if (!videosWithSponsorships?.length) return { message: 'missing_ids' }

    console.log('video details', videosWithSponsorships)

    indexBasicVideosToElastic(videosWithSponsorships, object).catch(err =>
      console.error('Failed to index to Elasticsearch:', err)
    )

    const combinedResults = [...elasticResults, ...videosWithSponsorships]
    console.log(
      `Total results: ${combinedResults.length} (${elasticResults.length} from ES + ${videosWithSponsorships.length} new)`
    )
    return { message: 'success', data: combinedResults }
  } catch (err) {
    console.error('error', err)
    return { message: 'error' }
  }
}

export async function searchYouTubeAction(query: string) {
  const results = await searchYouTube(query)
  return results
}

export async function readVideoData(videoUrl: string) {
  const { object } = await generateObject({
    model: google('gemini-2.5-flash'),
    system: SYSTEM_INSTRUCTION,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `
            Read the video, find me where in the video sponsor codes are mentioned.
            `,
          },
          {
            type: 'file',
            data: videoUrl,
            mediaType: 'video/mp4',
          },
        ],
      },
    ],
    schema: readVideoDataSchema,
  })
  console.log(object)
  return object
}

export async function filterVideoData(data: string, query: string) {
  const { object: filteredVideoData } = await generateObject({
    model: google('gemini-2.5-pro'),
    system: SYSTEM_INSTRUCTION,
    prompt: `
    Return data in the specified schema. Format the duration in a user-friendly format like: hh:mm:ss. Return the video data that hints at sponsorships with discount codes, not if it's just a review of a product, make sure it's actual deal/sponsorship product and is published within 3 months period from  ${new Date().toISOString()} against the publishedAt date. The user query is: ${query} Ultimately, you are filtering the video data to return the most relevant videos that match the user query.
    return.
    <video data>
    ${data}
    </video data>
    <rule>Do not modify the YouTube video data, only return the data that hints at sponsorships with discount codes.</rule>
    <rule>Make sure to keep the YouTube URLs as-is, do not change them.</rule>
    `,
    schema: videoSchema,
  })

  return await Promise.all(
    filteredVideoData.map(async video => {
      const videoData = await readVideoData(video.videoUrl)
      return {
        ...video,
        ...videoData,
      }
    })
  )
}

export async function getVideoDetailsAction(id: string) {
  const details = await getVideoDetails([id])
  console.log(details)
  return details
}

export async function generateUserInputEmbedding(input: string) {
  const model = google.textEmbedding('gemini-embedding-001')

  const { embedding } = await embed({
    model,
    value: input,
    providerOptions: {
      google: {
        outputDimensionality: 1536,
      },
    },
  })
  return embedding
}

export async function generateEmbeddings(queries: string[]) {
  const model = google.textEmbedding('gemini-embedding-001')
  const { embeddings } = await embedMany({
    model,
    values: queries,
    providerOptions: {
      google: {
        outputDimensionality: 1536,
        taskType: 'RETRIEVAL_QUERY',
      },
    },
  })
  return embeddings
}

async function storeExpandedQueries(queries: string[]) {
  const _cookieStore = await cookies()
  _cookieStore.set('expanded_queries', JSON.stringify(queries), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
  })
}

async function indexVideosToElastic(
  filteredVideoData: VideoData[],
  intent: Intent,
  youtubeVideos: VideoData[]
) {
  try {
    const videoIds = filteredVideoData
      .map(v => v.videoUrl || v.id)
      .filter((id): id is string => Boolean(id))
    await storeUserIntent(intent, videoIds)

    const videosToIndex = filteredVideoData.map(enrichedVideo => {
      const youtubeData = youtubeVideos.find(
        yt =>
          yt.id === enrichedVideo.id || yt.videoUrl === enrichedVideo.videoUrl
      )
      const base = youtubeData || enrichedVideo
      return {
        youtubeData: {
          id: base.id ?? undefined,
          title: base.title ?? undefined,
          description: base.description ?? undefined,
          thumbnail: base.thumbnail ?? undefined,
          channel: base.channel ?? undefined,
          publishedAt: base.publishedAt ?? undefined,
          views: base.views ?? undefined,
          duration: base.duration ?? undefined,
          tags: base.tags ?? undefined,
          hasPaidProductPlacement: base.hasPaidProductPlacement ?? undefined,
          videoUrl: base.videoUrl ?? undefined,
        },
        enrichedData: {
          sponsor: enrichedVideo.sponsor,
          offerType: enrichedVideo.offerType,
          offerLabel: enrichedVideo.offerLabel,
          offerDescription: enrichedVideo.offerDescription,
          discountCodes: enrichedVideo.discountCodes,
          discountCodeFromDescription:
            enrichedVideo.discountCodeFromDescription,
          discountCodesRevealTimeframe:
            enrichedVideo.discountCodesRevealTimeframe,
        },
      }
    })

    await storeMultipleVideos(videosToIndex)
    console.log(
      `Successfully indexed ${filteredVideoData.length} videos to Elasticsearch`
    )
  } catch (error) {
    console.error('Failed to index videos to Elasticsearch:', error)
    throw error
  }
}

async function indexBasicVideosToElastic(videos: VideoData[], intent: Intent) {
  try {
    const videoIds = videos
      .map(v => v.id)
      .filter((id): id is string => Boolean(id))
    await storeUserIntent(intent, videoIds)

    await Promise.allSettled(
      videos.map(video =>
        storeVideoData({
          id: video.id ?? undefined,
          title: video.title ?? undefined,
          description: video.description ?? undefined,
          thumbnail: video.thumbnail ?? undefined,
          channel: video.channel ?? undefined,
          publishedAt: video.publishedAt ?? undefined,
          views: video.views ?? undefined,
          duration: video.duration ?? undefined,
          tags: video.tags ?? undefined,
          hasPaidProductPlacement: video.hasPaidProductPlacement ?? undefined,
          videoUrl: video.videoUrl ?? undefined,
        })
      )
    )

    console.log(
      `Successfully indexed ${videos.length} basic videos to Elasticsearch`
    )
  } catch (error) {
    console.error('Failed to index basic videos to Elasticsearch:', error)
    throw error
  }
}

export async function searchVideosElastic(query: string) {
  try {
    const results = await searchElastic([query])
    return results
  } catch (error) {
    console.error('Elasticsearch search error:', error)
    return []
  }
}

export async function searchVideosWithEmbedding(query: string) {
  try {
    const embedding = await generateUserInputEmbedding(query)
    const results = await searchElasticWithVector(query, embedding)
    return results
  } catch (error) {
    console.error('Elasticsearch vector search error:', error)
    return []
  }
}

async function searchElasticWithExpandedQueries(
  expandedQueries: string[],
  originalQuery: string
) {
  try {
    const embedding = await generateUserInputEmbedding(originalQuery)
    const textResults = await searchElastic(expandedQueries)
    const vectorResults = await searchElasticWithVector(
      originalQuery,
      embedding
    )

    const resultsMap = new Map<string, VideoData>()

    for (const result of textResults) {
      if (result.id) {
        resultsMap.set(result.id, {
          id: result.id,
          title: result.title,
          description: result.description,
          thumbnail: result.thumbnail,
          channel: result.channel,
          publishedAt: result.publishedAt,
          views: result.views,
          duration: result.duration,
          sponsor: result.sponsor,
          offerType: result.offerType,
          offerLabel: result.offerLabel,
          offerDescription: result.offerDescription,
          videoUrl: result.videoUrl,
          discountCodes: result.discountCodes,
          discountCodeFromDescription: result.discountCodes?.[0]?.code,
          discountCodesRevealTimeframe: undefined,
        })
      }
    }

    for (const result of vectorResults) {
      if (result.id) {
        resultsMap.set(result.id, {
          id: result.id,
          title: result.title,
          description: result.description,
          thumbnail: result.thumbnail,
          channel: result.channel,
          publishedAt: result.publishedAt,
          views: result.views,
          duration: result.duration,
          sponsor: result.sponsor,
          offerType: result.offerType,
          offerLabel: result.offerLabel,
          offerDescription: result.offerDescription,
          videoUrl: result.videoUrl,
          discountCodes: result.discountCodes,
          discountCodeFromDescription: result.discountCodes?.[0]?.code,
          discountCodesRevealTimeframe: undefined,
        })
      }
    }

    const uniqueResults = Array.from(resultsMap.values())
    console.log(
      `Elasticsearch found ${uniqueResults.length} unique videos (${textResults.length} text + ${vectorResults.length} vector)`
    )

    return uniqueResults
  } catch (error) {
    console.error(' Elasticsearch search failed:', error)
    return []
  }
}

export async function mapToIntentDocument(
  intent: Intent,
  videoIds?: string[]
): Promise<IntentDocument> {
  const intentString = JSON.stringify(intent.intent)
  const embedding = await generateUserInputEmbedding(intentString)

  return {
    intent_id: crypto.randomUUID(),
    topics: intent.intent.topics,
    offer_type: intent.intent.offer_type,
    category: intent.intent.category,
    time: intent.intent.time,
    expandedQueries: intent.expandedQueries,
    embedding,
    video_ids: videoIds,
  }
}

export async function storeVideoData(
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
  }
) {
  try {
    const contentForEmbedding = `${youtubeData.title} ${
      youtubeData.description
    } ${enrichedData?.sponsor || ''} ${enrichedData?.offerDescription || ''}`
    const embedding = await generateUserInputEmbedding(contentForEmbedding)

    const document = mapToVideoDocument(youtubeData, enrichedData, embedding)
    await indexVideoData(document)
    console.log(`Indexed video: ${document.id} - ${document.title}`)
    return document
  } catch (error) {
    console.error(`Failed to index video: ${youtubeData.id}`, error)
    throw error
  }
}

export async function storeMultipleVideos(
  videos: Array<{
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
    }
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
    }
  }>
) {
  try {
    const documents: VideoDocument[] = []

    for (const video of videos) {
      const contentForEmbedding = `${video.youtubeData.title || ''} ${
        video.youtubeData.description || ''
      } ${video.enrichedData?.sponsor || ''} ${
        video.enrichedData?.offerDescription || ''
      }`
      const embedding = await generateUserInputEmbedding(contentForEmbedding)
      const document = mapToVideoDocument(
        video.youtubeData,
        video.enrichedData,
        embedding
      )

      const cleanDocument = Object.fromEntries(
        Object.entries(document).filter(([, v]) => v !== undefined)
      ) as VideoDocument

      documents.push(cleanDocument)
    }

    console.log(`Preparing to index ${documents.length} videos`)
    console.log('Sample document:', JSON.stringify(documents[0], null, 2))

    await bulkIndexVideos(documents)
    console.log(`Bulk indexed ${documents.length} videos`)
    return documents
  } catch (error) {
    console.error('Failed to bulk index videos', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}

export async function storeUserIntent(intent: Intent, videoIds?: string[]) {
  try {
    const intentDocument = await mapToIntentDocument(intent, videoIds)
    await indexIntent(intentDocument)
    console.log(`Stored user intent: ${intentDocument.intent_id}`)
    return intentDocument
  } catch (error) {
    console.error('Failed to store user intent', error)
    throw error
  }
}
