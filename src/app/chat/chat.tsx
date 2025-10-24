'use client'

import { Button } from '@/components/ui/button'
import { ButtonBlue } from '@/components/ui/button-blue'
import { Bot, ArrowLeft, Send, Search, Tag, Gift, Percent } from 'lucide-react'
import Link from 'next/link'
import { useActionState, useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import type { Message, Video } from '@/components/chat-types'
import { WelcomeCard } from '@/components/welcome-card'
import { SemanticExpansionCard } from '@/components/semantic-expansion-card'
import { VideoResultsCard } from '@/components/video-results-card'
import { FilterRefinementCard } from '@/components/filter-refinement-card'
import { RelatedTopicsCard } from '@/components/related-topics-card'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { expandIntent } from '@/actions'
import { Spinner } from '@/components/ui/spinner'

export function Chat({ expandedQueries }: { expandedQueries: string[] }) {
  const [inputValue, setInputValue] = useState('')
  const [pending, startTransition] = useTransition()

  const handleQuickAction = (message: string) => {
    setInputValue(message)

    setTimeout(() => {
      handleSendMessage({} as React.FormEvent<HTMLFormElement>, message)
    }, 100)
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        "Welcome to Tuit! I help you discover YouTube videos with brand sponsorships that include real benefits like promo codes, discounts, affiliate links, and exclusive offers. Tell me what kind of deals you're looking for, and I'll find the best sponsored content for you.",
      timestamp: new Date(),
      components: [
        <WelcomeCard key='welcome' onQuickAction={handleQuickAction} />,
      ],
    },
  ])

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const mockVideos: Video[] = [
    {
      id: 1,
      thumbnail: '/ai-transformer-neural-network-visualization.jpg',
      title: 'My Complete Camera Setup 2024 - Insta360 Sponsorship',
      channel: 'Tech Creator Pro',
      views: '342K',
      publishedAt: '1 week ago',
      duration: '12:34',
      sponsor: 'Insta360',
      offerType: '15% off code',
      offerLabel: 'TECH15',
      offerDescription:
        'Creator shares Insta360 X4 collab with 15% discount code valid till June 2025',
      relevance: 98,
    },
    {
      id: 2,
      thumbnail: '/attention-mechanism-deep-learning-diagram.jpg',
      title: 'Best Productivity Apps for Creators - Notion Partnership',
      channel: 'Creator Economy',
      views: '128K',
      publishedAt: '3 days ago',
      duration: '18:22',
      sponsor: 'Notion',
      offerType: 'Free trial',
      offerLabel: '3 months free',
      offerDescription:
        'Exclusive 3-month Notion Plus trial for new users through creator link',
      relevance: 95,
    },
    {
      id: 3,
      thumbnail: '/bert-gpt-transformer-comparison.jpg',
      title: 'Unboxing the NEW GoPro Hero 13 - Sponsored Review',
      channel: 'Adventure Vlogs',
      views: '567K',
      publishedAt: '2 weeks ago',
      duration: '15:47',
      sponsor: 'GoPro',
      offerType: 'Giveaway',
      offerLabel: 'Enter to win',
      offerDescription:
        'GoPro Hero 13 giveaway for subscribers, ends March 31st',
      relevance: 92,
    },
    {
      id: 4,
      thumbnail: '/neural-network-training-visualization.jpg',
      title: 'How I Edit Videos 10x Faster with Adobe Premiere',
      channel: 'Video Editing Mastery',
      views: '891K',
      publishedAt: '1 month ago',
      duration: '22:15',
      sponsor: 'Adobe',
      offerType: 'Affiliate promo',
      offerLabel: '20% off',
      offerDescription:
        'Adobe Creative Cloud 20% discount through affiliate link in description',
      relevance: 89,
    },
    {
      id: 5,
      thumbnail: '/transformer-architecture-tutorial.jpg',
      title: 'Best Microphones Under $200 - Audio-Technica Collab',
      channel: 'Audio Gear Reviews',
      views: '234K',
      publishedAt: '5 days ago',
      duration: '16:30',
      sponsor: 'Audio-Technica',
      offerType: 'Discount code',
      offerLabel: 'AUDIO20',
      offerDescription:
        '20% off Audio-Technica AT2020 with code AUDIO20, valid for 30 days',
      relevance: 87,
    },
    {
      id: 6,
      thumbnail: '/attention-is-all-you-need-paper.jpg',
      title: 'My Lighting Setup for YouTube - Elgato Partnership',
      channel: 'Studio Setup Guide',
      views: '445K',
      publishedAt: '2 weeks ago',
      duration: '14:18',
      sponsor: 'Elgato',
      offerType: 'Exclusive access',
      offerLabel: 'Early access',
      offerDescription:
        'Early access to new Elgato Key Light Air through creator partnership link',
      relevance: 85,
    },
  ]

  const generateDynamicComponents = (): React.ReactNode[] => {
    const components: React.ReactNode[] = []

    components.push(<SemanticExpansionCard key='semantic-expansion' />)
    components.push(
      <VideoResultsCard key='video-results' videos={mockVideos} />
    )
    components.push(<FilterRefinementCard key='refinement' />)
    components.push(<RelatedTopicsCard key='related-topics' />)

    return components
  }

  function handleSendMessage(
    evt: React.FormEvent<HTMLFormElement>,
    message?: string
  ) {
    evt.preventDefault()
    const $form = evt.currentTarget
    const formData = new FormData(evt.currentTarget)
    if (message) {
      formData.set('input', message)
    }
    startTransition(async () => {
      const state = await expandIntent({ message: '' }, formData)
      if (state.message === 'success' && state.data) {
        $form.reset()
        console.log(state.data)
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'assistant',
            content: `I've analysed your search intent. Here are the most relevant sponsored videos with user benefits.`,
            timestamp: new Date(),
            components: [
              <VideoResultsCard
                key='video-results'
                videos={(state.data as Video[]) || []}
              />,
            ],
          },
        ])
      }
    })

    setInputValue('')
  }

  return (
    <div className='flex flex-col h-screen bg-background'>
      <header className='border-b border-border/40 backdrop-blur-sm'>
        <div className='container flex items-center justify-between py-4'>
          <div className='flex items-center gap-4'>
            <Link
              href='/'
              className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              <span className='text-sm'>Back</span>
            </Link>
            <div className='flex items-center gap-2'>
              <Tag className='w-5 h-5 text-blue' />
              <div>
                <span className='text-xl font-bold'>Tuit</span>
                <div className='text-xs text-muted-foreground'>
                  AI Sponsorship Discovery
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='flex-1 overflow-y-auto'>
        <div className='container max-w-4xl py-6 space-y-6'>
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'assistant' && (
                <div className='w-8 h-8 rounded-lg bg-blue/[0.1] flex items-center justify-center flex-shrink-0 mt-1'>
                  <Bot className='w-4 h-4 text-blue' />
                </div>
              )}
              <div
                className={`max-w-[80%] space-y-3 ${
                  message.type === 'user' ? 'order-first' : ''
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-slate-800 to-slate-700 text-foreground ml-auto border border-border/20'
                      : 'bg-muted/50 border border-border/40'
                  }`}
                >
                  <p className='text-sm leading-relaxed'>{message.content}</p>
                  <div className='text-xs opacity-70 mt-2'>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                {message.components && (
                  <div className='space-y-4'>
                    {message.components.map((component, index) => (
                      <div key={index}>{component}</div>
                    ))}
                  </div>
                )}
              </div>
              {message.type === 'user' && (
                <div className='w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1'>
                  <Search className='w-4 h-4' />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='border-t border-border/40 bg-background/80 backdrop-blur-sm'>
        <div className='container max-w-4xl py-4'>
          <form onSubmit={handleSendMessage}>
            <fieldset className='flex gap-3' disabled={pending}>
              <div className='flex-1'>
                <Input
                  name='input'
                  required
                  placeholder='What kind of deals or sponsorships are you looking for?'
                  className='min-h-[44px] resize-none border-border/40 focus:border-blue/[0.5]'
                />
              </div>
              <ButtonBlue type='submit' className='h-[44px] px-6'>
                {pending ? <Spinner /> : <Send className='w-4 h-4' />}
              </ButtonBlue>
            </fieldset>
          </form>
          <div className='flex gap-2 mt-3 flex-wrap'>
            <Button
              variant='outline'
              size='sm'
              className='text-xs border-border/40 hover:bg-gradient-to-r hover:from-blue/[0.1] hover:to-blue/[0.05] bg-transparent transition-all duration-300 hover:border-blue/[0.4] hover:shadow-md hover:shadow-blue/[0.1]'
              onClick={() =>
                handleSuggestionClick(
                  'Show me VPN sponsorships with discount codes'
                )
              }
            >
              <Percent className='w-3 h-3 mr-1' />
              VPN deals
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='text-xs border-border/40 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-purple-500/5 bg-transparent transition-all duration-300 hover:border-purple-500/40 hover:shadow-md hover:shadow-purple-500/10'
              onClick={() =>
                handleSuggestionClick(
                  'Find creator tool sponsorships with free trials'
                )
              }
            >
              <Gift className='w-3 h-3 mr-1' />
              Free trials
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='text-xs border-border/40 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-emerald-500/5 bg-transparent transition-all duration-300 hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/10'
              onClick={() =>
                handleSuggestionClick('Tech gear giveaways and contests')
              }
            >
              <Gift className='w-3 h-3 mr-1' />
              Giveaways
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
