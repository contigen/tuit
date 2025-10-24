import { Client } from '@elastic/elasticsearch'

const ELASTIC_ENDPOINT = process.env.ELASTIC_SEARCH_ENDPOINT
const ELASTIC_PROJECT_ID = process.env.ELASTIC_SEARCH_PROJECT_ID
const ELASTIC_API_KEY = process.env.ELASTIC_SEARCH_API_KEY

if (!ELASTIC_ENDPOINT || !ELASTIC_PROJECT_ID || !ELASTIC_API_KEY) {
  console.error(' Missing required environment variables:')
}

const elastic = new Client({
  node: ELASTIC_ENDPOINT,
  auth: {
    apiKey: ELASTIC_API_KEY!,
  },
})

async function createIndices() {
  try {
    console.log('Checking Elasticsearch connection...')
    await elastic.ping()
    console.log('Connected to Elasticsearch successfully\n')

    const intentExists = await elastic.indices.exists({ index: 'user_intents' })
    if (!intentExists) {
      await elastic.indices.create({
        index: 'user_intents',
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
      })
      console.log('Created index: user_intents')
    } else {
      console.log('Index already exists: user_intents')
    }

    const videoExists = await elastic.indices.exists({ index: 'videos' })
    if (!videoExists) {
      await elastic.indices.create({
        index: 'videos',
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
      })
      console.log('Created index: videos')
    } else {
      console.log('Index already exists: videos')
    }

    console.log('\nAll indices are ready!')
  } catch (err) {
    console.error('\nError creating indices:')
    if (err instanceof Error) {
      console.error('Message:', err.message)
      if (err.stack) {
        console.error('\nStack trace:', err.stack)
      }
    } else {
      console.error(err)
    }
    process.exit(1)
  }
}

createIndices()
