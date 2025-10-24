import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tag, Percent, Gift, ExternalLink } from 'lucide-react'

type WelcomeCardProps = {
  onQuickAction: (message: string) => void
}

export function WelcomeCard({ onQuickAction }: WelcomeCardProps) {
  return (
    <Card className='relative overflow-hidden bg-gradient-to-br from-background via-background to-blue/[0.05] border-blue/[0.2]'>
      <div className='absolute inset-0 bg-gradient-to-br from-transparent via-blue/[0.03] to-blue/[0.08]' />
      <CardHeader className='relative z-10'>
        <CardTitle className='flex items-center gap-2 text-blue'>
          <Tag className='w-5 h-5' />
          Popular Deal Searches
        </CardTitle>
      </CardHeader>
      <CardContent className='relative z-10 grid grid-cols-2 gap-3'>
        <Button
          variant='outline'
          className='justify-start h-auto p-4 border-blue/[0.2] hover:bg-gradient-to-br hover:from-blue/[0.1] hover:to-blue/[0.05] bg-transparent transition-all duration-300 hover:border-blue/[0.4] hover:shadow-lg hover:shadow-blue/[0.1]'
          onClick={() =>
            onQuickAction(
              'Find tech gear sponsorships with discount codes for cameras, microphones, and lighting equipment'
            )
          }
        >
          <Percent className='w-4 h-4 mr-2' />
          <div className='text-left'>
            <div className='font-medium'>Tech Gear Deals</div>
            <div className='text-xs text-muted-foreground'>
              Cameras & equipment
            </div>
          </div>
        </Button>
        <Button
          variant='outline'
          className='justify-start h-auto p-4 border-blue/[0.2] hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-purple-500/5 bg-transparent transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10'
          onClick={() =>
            onQuickAction(
              'Show me software and SaaS sponsorships with free trial offers and promo codes'
            )
          }
        >
          <Gift className='w-4 h-4 mr-2' />
          <div className='text-left'>
            <div className='font-medium'>Software Trials</div>
            <div className='text-xs text-muted-foreground'>
              Free access codes
            </div>
          </div>
        </Button>
        <Button
          variant='outline'
          className='justify-start h-auto p-4 border-blue/[0.2] hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-emerald-500/5 bg-transparent transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10'
          onClick={() =>
            onQuickAction(
              'Find creator affiliate programs with exclusive discount links for viewers'
            )
          }
        >
          <ExternalLink className='w-4 h-4 mr-2' />
          <div className='text-left'>
            <div className='font-medium'>Affiliate Programs</div>
            <div className='text-xs text-muted-foreground'>Exclusive links</div>
          </div>
        </Button>
        <Button
          variant='outline'
          className='justify-start h-auto p-4 border-blue/[0.2] hover:bg-gradient-to-br hover:from-orange-500/10 hover:to-orange-500/5 bg-transparent transition-all duration-300 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10'
          onClick={() =>
            onQuickAction(
              'Show me giveaway sponsorships and contest opportunities from creators'
            )
          }
        >
          <Gift className='w-4 h-4 mr-2' />
          <div className='text-left'>
            <div className='font-medium'>Giveaways</div>
            <div className='text-xs text-muted-foreground'>Contest entries</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  )
}
