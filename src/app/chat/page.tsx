import { cookies } from 'next/headers'
import { Chat } from './chat'

export async function getExpandedQueries() {
  const _cookieStore = await cookies()
  const expandedQueries = _cookieStore.get('expanded_queries')
  if (!expandedQueries) return []
  try {
    return JSON.parse(expandedQueries.value) as string[]
  } catch {
    return []
  }
}

export default async function Page() {
  const expandedQueries = await getExpandedQueries()
  return <Chat expandedQueries={expandedQueries} />
}
