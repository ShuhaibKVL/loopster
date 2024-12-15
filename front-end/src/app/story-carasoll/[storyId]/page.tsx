import StoryCarasoll from '@/components/story/StoryCarasoll'
import React from 'react'

export default function page({params}:{params:{storyId:string}}) {
  console.log('params reached on carasol :',params)
  return (
    <StoryCarasoll storyId={params?.storyId} />
  )
}
