import { Tag } from 'lucide-react'

export default function Loading() {
  return (
    <div className='h-dvh grid place-items-center'>
      <div className='relative'>
        <div className='flex items-center justify-center size-16 rounded-full bg-primary/20 animate-pulse-slow'>
          <Tag className='size-8 text-blue' />
        </div>
        <div className='absolute inset-0 size-16 border-2 rounded-full border-blue/30 animate-spin border-t-blue' />
      </div>
    </div>
  )
}
