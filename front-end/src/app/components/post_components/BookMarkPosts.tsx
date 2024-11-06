'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch';
import { RootState } from '@/lib/redux/store/store';
import { useInfiniteQuery } from '@tanstack/react-query';
import PostSkelton from '@/app/components/skeltons/PostSkelton';
import Post from '@/app/components/post_components/Post';
import postService from '@/services/user/post/postServices';
import { IPostProps } from '@/lib/utils/interfaces/PostProps';

export default function BookMarkPosts() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state: RootState) => state?.user?.userId);
  const listRef = useRef(null)
  const [ isLoadingMore , setIsLoadingMore] = useState(false)

  const fetchPosts = async (userId: string, page: number) => {
    if (userId) {
      // const data = await dispatch(followedUsersPosts({ userId, page })).unwrap();
      const response = await postService.getBookMarkedPosts(userId,page)
      const data : IPostProps[] = response?.posts
      console.log('data :>>>>>>>>>>>>>>>>>>>>>>',data)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { posts: data, hasMore: data.length > 0 };
    }
    return { posts: [], hasMore: false }; // Handle invalid userId
  };

  const { data, fetchNextPage, hasNextPage, isFetching , refetch } = useInfiniteQuery({
    queryKey: ['followersPosts', userId],
    queryFn: async ({ queryKey, pageParam = 1 }) => {
      const userId = queryKey[1];
      return await fetchPosts(userId, pageParam); // Pass the current page
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1; // Get the next page number
      return lastPage.hasMore ? nextPage : undefined; // Only return nextPage if there are more
    },
    initialPageParam: 1,
  });

  const posts = data?.pages.flatMap(page => page.posts) || [];

  const handleIntersection = (entries:IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasNextPage && !isFetching && !isLoadingMore) {
      setIsLoadingMore(true);
      fetchNextPage();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, { threshold: 1.0 });

    if (listRef.current) {
      observer.observe(listRef.current);
    }

    return () => {
      if (listRef.current) {
        observer.unobserve(listRef.current);
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
