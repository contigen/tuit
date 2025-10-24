import { Client } from '@elastic/elasticsearch'
import type {
  VideoDocument,
  IntentDocument,
  SearchResult,
} from './elastic-types'

type ElasticHit = {
  _source?: VideoDocument
  _id: string
  _index: string
  _type: string
  _score?: number
}

export const elastic = new Client({
  node: process.env.ELASTIC_SEARCH_ENDPOINT!,
  auth: {
    apiKey: process.env.ELASTIC_SEARCH_API_KEY!,
  },
})

export const videoDataMapping = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      title: { type: 'text', analyzer: 'english' },
      description: { type: 'text', analyzer: 'english' },
      thumbnail: { type: 'keyword', index: false },
      channel: { type: 'text', analyzer: 'english' },
      publishedAt: { type: 'date' },
      views: { type: 'keyword' },
      duration: { type: 'keyword' },
      tags: { type: 'keyword' },
      hasPaidProductPlacement: { type: 'boolean' },
      sponsor: { type: 'text', analyzer: 'english' },
      offerType: { type: 'keyword' },
      offerLabel: { type: 'text' },
      offerDescription: { type: 'text', analyzer: 'english' },
      discountCodes: {
        type: 'nested',
        properties: {
          code: { type: 'keyword' },
          description: { type: 'text' },
          sponsorUrl: { type: 'keyword', index: false },
        },
      },
      discountCodeFromDescription: { type: 'keyword' },
      discountCodesRevealTimeframe: { type: 'keyword' },
      videoUrl: { type: 'keyword', index: false },
      embedding: {
        type: 'dense_vector',
        dims: 1536,
        index: true,
        similarity: 'cosine',
      },
      created_at: { type: 'date' },
    },
  },
}

export const intentDataMapping = {
  mappings: {
    properties: {
      intent_id: { type: 'keyword' },
      topics: { type: 'keyword' },
      offer_type: { type: 'keyword' },
      category: { type: 'keyword' },
      time: {
        type: 'date',
        format: 'strict_date_optional_time||epoch_millis',
      },
      expandedQueries: { type: 'text' },
      embedding: {
        type: 'dense_vector',
        dims: 1536,
        index: true,
        similarity: 'cosine',
      },
      created_at: { type: 'date' },
      video_ids: { type: 'keyword' },
    },
  },
}

export async function searchElastic(
  queries: string[],
  index = 'videos'
): Promise<SearchResult[]> {
  const results: SearchResult[] = []

  for (const q of queries) {
    const res = await elastic.search({
      index,
      size: 5,
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: q,
                fields: [
                  'title^3',
                  'description^2',
                  'sponsor^2',
                  'offerDescription',
                  'channel',
                ],
                type: 'best_fields',
                fuzziness: 'AUTO',
              },
            },
          ],
        },
      },
    })

    const hits = (res.hits?.hits || []) as ElasticHit[]
    results.push(
      ...hits.map((hit: ElasticHit) => ({
        source: 'elastic',
        id: hit._source?.id || '',
        title: hit._source?.title || '',
        description: hit._source?.description || '',
        thumbnail: hit._source?.thumbnail || '',
        channel: hit._source?.channel || '',
        publishedAt: hit._source?.publishedAt || '',
        views: hit._source?.views || '',
        duration: hit._source?.duration || '',
        sponsor: hit._source?.sponsor,
        offerType: hit._source?.offerType,
        offerLabel: hit._source?.offerLabel,
        offerDescription: hit._source?.offerDescription,
        discountCodes: hit._source?.discountCodes,
        videoUrl: hit._source?.videoUrl || '',
      }))
    )
  }

  return results
}

export async function searchElasticWithVector(
  query: string,
  embedding: number[],
  index = 'videos'
): Promise<SearchResult[]> {
  const res = await elastic.search({
    index,
    size: 10,
    query: {
      bool: {
        should: [
          {
            multi_match: {
              query,
              fields: [
                'title^3',
                'description^2',
                'sponsor^2',
                'offerDescription',
                'channel',
              ],
              type: 'best_fields',
              fuzziness: 'AUTO',
            },
          },
          {
            script_score: {
              query: { match_all: {} },
              script: {
                source:
                  "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                params: { query_vector: embedding },
              },
            },
          },
        ],
      },
    },
  })

  const hits = (res.hits?.hits || []) as ElasticHit[]
  return hits.map((hit: ElasticHit) => ({
    source: 'elastic',
    id: hit._source?.id || '',
    title: hit._source?.title || '',
    description: hit._source?.description || '',
    thumbnail: hit._source?.thumbnail || '',
    channel: hit._source?.channel || '',
    publishedAt: hit._source?.publishedAt || '',
    views: hit._source?.views || '',
    duration: hit._source?.duration || '',
    sponsor: hit._source?.sponsor,
    offerType: hit._source?.offerType,
    offerLabel: hit._source?.offerLabel,
    offerDescription: hit._source?.offerDescription,
    discountCodes: hit._source?.discountCodes,
    videoUrl: hit._source?.videoUrl || '',
  }))
}

export async function indexIntent(intent: IntentDocument) {
  await elastic.index({
    index: 'user_intents',
    document: {
      ...intent,
      created_at: new Date().toISOString(),
    },
  })
}

export async function indexVideoData(videoData: VideoDocument) {
  try {
    await elastic.index({
      index: 'videos',
      document: {
        ...videoData,
        created_at: new Date().toISOString(),
        publishedAt: videoData.publishedAt || new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error(' Elasticsearch index error:', error)
    if (error && typeof error === 'object' && 'meta' in error) {
      console.error(
        'Error meta:',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        JSON.stringify((error as any).meta?.body?.error, null, 2)
      )
    }
    throw error
  }
}

export async function bulkIndexVideos(videos: VideoDocument[]) {
  console.log(`📤 Preparing to index ${videos.length} videos`)

  const operations = videos.flatMap(video => [
    { index: { _index: 'videos' } },
    {
      ...video,
      created_at: new Date().toISOString(),
      publishedAt: video.publishedAt || new Date().toISOString(),
    },
  ])

  if (videos.length > 0) {
    console.log('Sample document:', JSON.stringify(operations[1], null, 2))
  }

  try {
    const result = await elastic.bulk({ operations })

    if (result.errors) {
      const erroredDocuments = result.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ?.filter((item: any) => item.index?.error)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ({
          id: item.index?._id,
          error: item.index?.error,
        }))

      if (erroredDocuments && erroredDocuments.length > 0) {
        console.error(
          'Bulk index errors:',
          JSON.stringify(erroredDocuments, null, 2)
        )
      }
    } else {
      console.log(
        `✅ Successfully indexed ${videos.length} videos to Elasticsearch`
      )
    }

    return result
  } catch (error) {
    console.error(' Elasticsearch bulk index error:', error)
    if (error && typeof error === 'object' && 'meta' in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error('Error meta:', JSON.stringify((error as any).meta, null, 2))
    }
    throw error
  }
}
