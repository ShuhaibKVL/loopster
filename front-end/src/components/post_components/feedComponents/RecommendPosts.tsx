import { useAppDispatch, useAppSelector } from '@/hooks/typedUseDispatch';
import { fetchLatestPosts } from '@/lib/redux/features/postSlice';
import { RootState } from '@/lib/redux/store/store';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import PostSkelton from '../../skeltons/PostSkelton';
import Post from '../Post';

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
    return { posts: [], hasMore: false };
  };

  const { data, fetchNextPage, hasNextPage, isFetching,refetch } = useInfiniteQuery({
    queryKey: ['recommendedPosts', userId],
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

    const refetchWrapper = async() =>{
      refetch()
    }

  return (
    <div>
      {posts.map((post,index) => (
        <Post key={index} postData={post} refetchPosts={refetchWrapper} />
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
