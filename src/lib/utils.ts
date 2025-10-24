import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Intent } from './schema'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toEmbeddingText(data: Intent) {
  const { intent, expandedQueries } = data

  const topics = intent.topics?.length
    ? `The user is interested in topics like ${intent.topics.join(', ')}.`
    : ''
  const offers = intent.offer_type?.length
    ? `They are looking for offer types such as ${intent.offer_type.join(
        ', '
      )}.`
    : ''
  const categories = intent.category?.length
    ? `The relevant categories include ${intent.category.join(', ')}.`
    : ''
  const time = intent.time
    ? `The search or promotion period of interest is ${intent.time}.`
    : ''
  const expansions = expandedQueries?.length
    ? `Expanded search queries that describe what the user might mean include: ${expandedQueries
        .map(q => `"${q}"`)
        .join(', ')}.`
    : ''

  const joined = [topics, offers, categories, time, expansions]
    .filter(Boolean)
    .join(' ')
  return joined.trim()
}
