'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';
import { useInfiniteQuery } from '@tanstack/react-query';
import PostSkelton from '@/components/skeltons/PostSkelton';
import Post from '@/components/post_components/Post';
import postService from '@/services/user/post/postServices';
import { IPostProps } from '@/lib/utils/interfaces/PostProps';

export default function BookMarkPosts() {
  const userId = useAppSelector((state: RootState) => state?.user?.userId);
  const listRef = useRef(null)
  const [ isLoadingMore , setIsLoadingMore] = useState(false)

  const fetchPosts = async (userId: string, page: number) => {
    if (userId) {
      const response = await postService.getBookMarkedPosts(userId,page)
      console.log('response :',response)
      const data : IPostProps[] = response?.posts
      console.log('data :>>>>>>>>>>>>>>>>>>>>>>',data)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { posts: data, hasMore: data.length > 0 };
    }
    return { posts: [], hasMore: false };
  };

  const { data, fetchNextPage, hasNextPage, isFetching , refetch } = useInfiniteQuery({
    queryKey: ['followersPosts', userId],
    queryFn: async ({ queryKey, pageParam = 1 }) => {
      const userId = queryKey[1];
      return await fetchPosts(userId, pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.hasMore ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  const posts = data?.pages.flatMap(page => page.posts) || [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleIntersection = (entries:IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasNextPage && !isFetching && !isLoadingMore) {
      setIsLoadingMore(true);
      fetchNextPage();
    }
  };

  useEffect(() => {
    const currrentRef = listRef.current
    const observer = new IntersectionObserver(handleIntersection, { threshold: 1.0 });

    if (currrentRef) {
      observer.observe(currrentRef);
    }

    return () => {
      if (currrentRef) {
        observer.unobserve(currrentRef);
      }
    };
  }, [listRef, handleIntersection]);

  useEffect(() => {
    if (!isFetching) {
      setIsLoadingMore(false);
    }
  }, [isFetching]);

  return (
    <>
    <h1 className='w-full text-center'>Saved Posts</h1>
      {posts.map((post) => (
        <Post key={post?._id} postData={post} refetchPosts={refetch} />
      ))}
      <div ref={listRef} className='w-full h-2 flex flex-col items-center justify-center'>
      {!hasNextPage &&
      <>
      <span className="loading loading-ring loading-xs"></span>
      </>
      }
      </div>
      <p className='w-full text-center text-[var(--color-bg)] '>{posts.length <= 0 ? 'No more saved posts' : ''}</p>
      {isFetching && <PostSkelton />}
    </>
  )
}
