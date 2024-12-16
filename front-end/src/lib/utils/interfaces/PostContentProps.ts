// import { InfiniteData, QueryObserverResult } from "@tanstack/react-query";

export interface PostContentProps {
    mediaUrl: File | null | undefined;
    content: string;
    time: Date | undefined |string;
    mediaType:"none" | "video" | "image";
    postId:string;
    userId:string;
    isLiked?:boolean;
    likeCount?:number;
    isBookMarked?:boolean;
    refetchPosts: () => Promise<void> ;
    // | (() => Promise<QueryObserverResult<InfiniteData<{ posts: unknown; hasMore: boolean }>, Error>> );
}