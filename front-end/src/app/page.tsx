import { Button } from '@/components/ui/button';
import ThemToggle from '@/components/cm/ThemeToggle'
import Link from 'next/link';
export default function Home() {
  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <h1>Next.js</h1>
    //   {/* <ThemToggle/> */}
    //   use adbdu recomeneted library , dais ui to create interactive design
    //   <h1>Explore with world..</h1>
    //   <Link href={'/signIn'}><Button className='border-secondary bg-white border'>Sign In</Button></Link>
    // </div>
    <div className='w-full min-h-screen bg-green-500'>
      <div className='w-full h-[80vh] bg-gray-500 flex items-center justify-end p-16'>
        <div className='w-[40vw] h-[80%] bg-yellow-100 rounded-lg'>

        </div>
      </div>
    </div>
  );
}
