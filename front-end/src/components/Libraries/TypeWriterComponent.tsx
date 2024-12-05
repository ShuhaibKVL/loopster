import React from 'react'
import { Typewriter } from 'react-simple-typewriter'

interface TypeWriterProps{
    words:string,
    cursorStyle?:string,
    typeSpeed?:number,
    deleteSpeed?:number,
    delaySpeed?:number,
    loop?:number,
}
export default function TypeWriterComponent({cursorStyle = '|',delaySpeed = 1000,deleteSpeed = 0,typeSpeed = 10,words ='Hi, How is this animation.',loop=2}:TypeWriterProps) {
  return (
      <Typewriter
          words={[words]}
          loop={loop}
          cursor
          cursorStyle={cursorStyle}
          typeSpeed={typeSpeed}
          cursorBlinking
          deleteSpeed={deleteSpeed}
          delaySpeed={delaySpeed}
        />
  )
}
