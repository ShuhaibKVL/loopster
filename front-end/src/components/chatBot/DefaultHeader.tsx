import { useAppSelector } from '@/hooks/typedUseDispatch'
import { RootState } from '@/lib/redux/store/store'
import React from 'react'
import { Typewriter } from 'react-simple-typewriter'

export default function DefaultHeader() {
  const user = useAppSelector((state:RootState) => state?.user?.user)

  return (
    <div className='w-full h-full place-content-center'>
          <div className="typing-animation text-center">
            <h1 className='text-md font-bold'>
              <Typewriter
                words={[`Hello Mr. ${user.toUpperCase()} 🙌😉`]}
                loop={2}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                cursorBlinking
                deleteSpeed={0}
                delaySpeed={1000}
              />
            </h1>
            <h1 className='text-lg font-thin'>
              <Typewriter
                words={['Let explore with our trained bot.🤖🥳🥳']}
                loop={2}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                cursorBlinking
                deleteSpeed={0}
                delaySpeed={Infinity}
                onLoopDone={stop}
              />
              </h1>
              </div>
        </div>
  )
}
