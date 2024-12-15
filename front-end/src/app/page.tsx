import { Button } from '@/components/ui/button';
import ThemToggle from '@/components/cm/ThemeToggle'
import Link from 'next/link';
import { BackgroundLines } from '@/components/ui/background-lines';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import ThemeToggle from '@/components/cm/ThemeToggle';
import Image from 'next/image';
export default function Home() {
  return (
    <div className='min-h-screen w-full bg-[var(--secondary-bg)]'>
        <BackgroundLines className="flex items-center justify-center w-full min-h-screen flex-col px-4">
        <div className='absolute right-10 top-3'>
        <ThemeToggle />
      </div>

      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b 
        from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl 
        md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Loopster<br /> 
        <span className='text-md md:text-md lg:text-2xl'>
          Share your ideas and connect with each others
        </span> 
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
        Goin with us to embrak your journey with your freinds.Share your thoughts and inspired others and connect with each
      </p>
      <Link href={'/signIn'}>
      <HoverBorderGradient>
        Sign In
      </HoverBorderGradient>
      </Link>
        </BackgroundLines>

        <div className='min-h-screen w-full flex items-center'>
        <div className="mockup-phone border-primary">
            <div className="camera"></div>
            <div className="display">
              <div className="artboard artboard-demo phone-1">
              jhfkdf fhkd
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
