import React, { useEffect, useRef, useState } from 'react';
import Post from '../Post';
import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch';
import useUserData from '@/hooks/customHooks/useUserData';
import { RootState } from '@/lib/redux/store/store';
import { fetchLatestPosts, setPage } from '@/lib/redux/features/postSlice';
import { useInfiniteQuery } from '@tanstack/react-query';
import PostSkelton from '../../skeltons/PostSkelton';

export default function RecommendPosts() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state: RootState) => state?.user?.userId);
  const listRef = useRef(null)
  const [ isLoadingMore , setIsLoadingMore] = useState(false)

  const fetchPosts = async (userId: string, page: number) => {
    // dispatch(setPage(page))
    if (userId) {
      const data = await dispatch(fetchLatestPosts({ userId, page })).unwrap();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { posts: data, hasMore: data.length > 0 };
    }
    return { posts: [], hasMore: false }; // Handle invalid userId
  };

  const { data, fetchNextPage, hasNextPage, isFetching,refetch } = useInfiniteQuery({
    queryKey: ['recommendedPosts', userId],
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
    <div>
      {posts.map((post) => (
        <Post key={post?._id} postData={post} refetchPosts={refetch} />
      ))}
      <div ref={listRef} className='w-full h-2 flex flex-col items-center justify-center'>
      {!hasNextPage &&
      <>
      <p className='w-full text-center text-[var(--color-bg)]'>No more posts to show</p>
      <span className="loading loading-ring loading-xs"></span>
      </>
      }
      </div>
      {isFetching && <PostSkelton />}
    </div>
  ); 
}
