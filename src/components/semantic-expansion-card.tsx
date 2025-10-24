import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

export function SemanticExpansionCard() {
  return (
    <Card className='relative overflow-hidden bg-gradient-to-br from-background via-background to-blue/[0.12] border-blue/[0.2]'>
      <div className='absolute inset-0 bg-gradient-to-br from-transparent via-blue/[0.08] to-blue/[0.15]' />
      <CardHeader className='relative z-10'>
        <CardTitle className='flex items-center gap-2 text-blue'>
          We expanded your search to capture related sponsorships
        </CardTitle>
      </CardHeader>
      <CardContent className='relative z-10 space-y-3'>
        <p className='text-sm text-muted-foreground'>
          Here are semantic variations to find the most relevant sponsored
          content:
        </p>
        <div className='flex flex-wrap gap-2'>
          <Badge
            variant='outline'
            className='cursor-pointer hover:bg-blue/[0.1] border-blue/[0.3] text-blue transition-all'
            title='Search again with this focus'
          >
            <Search className='w-3 h-3 mr-1' />
            YouTuber affiliate campaigns
          </Badge>
          <Badge
            variant='outline'
            className='cursor-pointer hover:bg-purple-500/10 border-purple-500/30 text-purple-400 transition-all'
            title='Search again with this focus'
          >
            <Search className='w-3 h-3 mr-1' />
            Discount codes for creator gear
          </Badge>
          <Badge
            variant='outline'
            className='cursor-pointer hover:bg-emerald-500/10 border-emerald-500/30 text-emerald-400 transition-all'
            title='Search again with this focus'
          >
            <Search className='w-3 h-3 mr-1' />
            Tech sponsorship promo offers
          </Badge>
          <Badge
            variant='outline'
            className='cursor-pointer hover:bg-orange-500/10 border-orange-500/30 text-orange-400 transition-all'
            title='Search again with this focus'
          >
            <Search className='w-3 h-3 mr-1' />
            Brand collaboration deals
          </Badge>
          <Badge
            variant='outline'
            className='cursor-pointer hover:bg-blue-500/10 border-blue-500/30 text-blue-400 transition-all'
            title='Search again with this focus'
          >
            <Search className='w-3 h-3 mr-1' />
            Exclusive viewer benefits
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
