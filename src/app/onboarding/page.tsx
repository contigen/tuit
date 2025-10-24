'use client'
import { useState, useRef, useActionState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button, ButtonWithSpinner } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'
import { expandIntent } from '@/actions'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const profile = {
    name: '',
  }
  const [preferences, setPreferences] = useState({
    benefitTypes: [] as string[],
    brands: [] as string[],
    contentTypes: [] as string[],
  })

  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const stepRefs = useMemo(() => [ref1, ref2], [ref1, ref2])

  const [state, formAction, pending] = useActionState<{
    message: 'missing_input' | 'success' | ''
  }>(
    expandIntent as unknown as (state: {
      message: 'missing_input' | 'success' | ''
    }) => Promise<{ message: 'missing_input' | 'success' | '' }>,
    { message: '' }
  )

  const benefitTypeSuggestions = [
    'Discount Codes',
    'Affiliate Links',
    'Giveaways',
    'Free Trials',
    'Exclusive Access',
  ]

  const brandSuggestions = [
    'NordVPN',
    'Skillshare',
    'Insta360',
    'GoPro',
    'Audible',
    'Squarespace',
    'Brilliant',
    'HelloFresh',
  ]

  const contentTypeSuggestions = [
    'Tech Reviews',
    'Tutorials',
    'Vlogs',
    'Unboxings',
    'Comparisons',
    'Lifestyle',
  ]

  const togglePreference = (
    category: 'benefitTypes' | 'brands' | 'contentTypes',
    item: string
  ) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item],
    }))
  }

  const handleComplete = () => {
    localStorage.setItem('Tuit_onboarding_complete', 'true')
    localStorage.setItem('Tuit_user_profile', JSON.stringify(profile))
    localStorage.setItem('Tuit_preferences', JSON.stringify(preferences))
    router.push('/chat')
  }

  useEffect(() => {
    if (state?.message === 'success') {
      toast.info('Intent expanded successfully')
      setCurrentStep(1)
      stepRefs[1]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [state, stepRefs])

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8 max-w-2xl'>
        <div className='text-center mb-12'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <h1 className='text-3xl font-semibold'>Welcome to Tuit</h1>
          </div>
          <p className='text-muted-foreground'>
            Your smart companion for discovering creator deals and sponsorships
          </p>
        </div>

        <div className='space-y-8'>
          {currentStep >= 0 && (
            <div ref={stepRefs[0]} className='scroll-mt-8'>
              <Card className='bg-gradient-to-br from-background to-muted/20 border-border/40 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle>Tell us about yourself</CardTitle>
                  <CardDescription>
                    Help us personalize your deal discovery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={formAction}>
                    <fieldset disabled={pending} className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='input'>Input (optional)</Label>
                        <Input
                          id='input'
                          name='input'
                          placeholder='What are you looking for?'
                        />
                      </div>
                      <div className='flex justify-end'>
                        <ButtonWithSpinner
                          className='bg-blue hover:bg-blue/90 text-white'
                          pending={pending}
                        >
                          Continue
                        </ButtonWithSpinner>
                      </div>
                    </fieldset>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep >= 1 && (
            <div ref={stepRefs[1]} className='scroll-mt-8'>
              <Card className='bg-gradient-to-br from-background to-muted/20 border-border/40 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2'>
                    <span>Customize Your Discovery</span>
                  </CardTitle>
                  <CardDescription>
                    Fine-tune what types of deals and content you want to see
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div>
                    <Label className='mb-3 block'>Benefit Types</Label>
                    <div className='flex flex-wrap gap-2'>
                      {benefitTypeSuggestions.map(benefit => (
                        <Badge
                          key={benefit}
                          variant={
                            preferences.benefitTypes.includes(benefit)
                              ? 'default'
                              : 'outline'
                          }
                          className={`cursor-pointer transition-all ${
                            preferences.benefitTypes.includes(benefit)
                              ? 'bg-[hsl(var(--blue))] hover:bg-[hsl(var(--blue))/0.9] text-white'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() =>
                            togglePreference('benefitTypes', benefit)
                          }
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className='mb-3 block'>
                      Favorite Brands (optional)
                    </Label>
                    <div className='flex flex-wrap gap-2'>
                      {brandSuggestions.map(brand => (
                        <Badge
                          key={brand}
                          variant={
                            preferences.brands.includes(brand)
                              ? 'default'
                              : 'outline'
                          }
                          className={`cursor-pointer transition-all ${
                            preferences.brands.includes(brand)
                              ? 'bg-[hsl(var(--blue))] hover:bg-[hsl(var(--blue))/0.9] text-white'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => togglePreference('brands', brand)}
                        >
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className='mb-3 block'>Content Types</Label>
                    <div className='flex flex-wrap gap-2'>
                      {contentTypeSuggestions.map(type => (
                        <Badge
                          key={type}
                          variant={
                            preferences.contentTypes.includes(type)
                              ? 'default'
                              : 'outline'
                          }
                          className={`cursor-pointer transition-all ${
                            preferences.contentTypes.includes(type)
                              ? 'bg-[hsl(var(--blue))] hover:bg-[hsl(var(--blue))/0.9] text-white'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => togglePreference('contentTypes', type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className='pt-4 border-t border-border/40'>
                    <Button
                      onClick={handleComplete}
                      className='w-full bg-[hsl(var(--blue))] hover:bg-[hsl(var(--blue))/0.9] text-white'
                      size='lg'
                    >
                      <CheckCircle className='w-4 h-4 mr-2' />
                      Complete Setup & Start Discovering
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
