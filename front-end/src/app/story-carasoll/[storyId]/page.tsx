import StoryCarasoll from '@/components/story/StoryCarasoll'
import React from 'react'

export default function page({params}:{params:{storyId:string}}) {
  return (
    <StoryCarasoll storyId={params?.storyId} />
  )
}
