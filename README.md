# Tuit

An AI-powered search engine for YouTube sponsorships with real user benefits. Find discount codes, affiliate links, giveaways, and exclusive offers from trusted creators.

## Features

- **Intelligent Search**: Natural language queries like "VPN deals with discount codes"
- **Semantic Understanding**: Vector embeddings find conceptually similar sponsorships
- **Code Extraction**: AI extracts discount codes directly from video content
- Smart Caching
- **Deal Validation**: Filters for fresh sponsorships (within 3 months)

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **AI**: Google Gemini 2.5 (Flash & Pro) with multimodal video analysis, Gemini text embeddings
- **Search**: Elasticsearch with dense vector embeddings (1536-dim)
- **APIs**: YouTube Data API v3
- **Styling**: Tailwind CSS with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- Elasticsearch 8.x cluster
- Google AI API key
- YouTube Data API key

### Environment Variables

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
YOUTUBE_API_KEY=your_youtube_key
ELASTIC_SEARCH_ENDPOINT=https://your-endpoint
ELASTIC_SEARCH_API_KEY=your_elastic_key
```

### Installation

```bash
# Install dependencies
bun install

# Create Elasticsearch indices
bun src/scripts/create-index.ts

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to start searching.

## License

MIT License - see [LICENSE](LICENSE) file for details.
