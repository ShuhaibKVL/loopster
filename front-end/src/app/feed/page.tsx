// 'use client'

// import withAuth from '@/app/contexts/withAuth';
import CreatePostComponent from '@/components/post_components/CreatePost';
import { Suspense } from 'react';
import CreatePostSkelton from '@/components/skeltons/CreatePostSkelton';
import PostTabs from '@/components/post_components/Tabs';
import StoryComponent from '@/components/story/StoryComponent';
import { cookies } from "next/headers";

const Page = async () => {

    const cookieStore = cookies();

    const session = cookieStore.get("session");
    console.log('session in feed server component :',session)
    
    if(session){
    const sessionData = JSON.parse(session?.value as string);

    console.log('session data on feed :',sessionData)
    }
 

    return (
        <div className='h-fit flex flex-col gap-2 '>
            <StoryComponent />
            <div className='hidden sm:block'>
                <Suspense fallback={<CreatePostSkelton />} >
                    <CreatePostComponent />
                </Suspense>
            </div>
            <PostTabs />            
        </div>
    );
};

// export default withAuth(Page, true);
export default Page