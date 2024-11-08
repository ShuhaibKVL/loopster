'use client'

import withAuth from '@/app/contexts/withAuth';
import CreatePostComponent from '@/app/components/post_components/CreatePost';
import { Suspense } from 'react';
import CreatePostSkelton from '@/app/components/skeltons/CreatePostSkelton';
import PostTabs from '@/app/components/post_components/Tabs';

const Page = () => {
    return (
        <div className='h-fit flex flex-col gap-2'>
            <div className='hidden sm:block'>
                <Suspense fallback={<CreatePostSkelton />} >
                    <CreatePostComponent />
                </Suspense>
            </div>
            <PostTabs />            
        </div>
    );
};

export default withAuth(Page, true);