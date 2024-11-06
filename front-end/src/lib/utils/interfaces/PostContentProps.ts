import { InfiniteData, QueryObserverResult } from "@tanstack/react-query";

export interface PostContentProps {
    mediaUrl: File | null | undefined;
    content: string;
    time: Date | undefined |string,
    mediaType:"none" | "video" | "image",
    postId:string,
    userId:string,
    isLiked?:boolean,
    isBookMarked?:boolean,
    refetchPosts: () => Promise<QueryObserverResult<InfiniteData<{ posts: any; hasMore: boolean }>, Error>>;
}