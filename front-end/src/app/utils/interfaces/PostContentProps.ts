export interface PostContentProps {
    mediaUrl: File | null | undefined;
    content: string;
    time: Date | undefined,
    mediaType:"none" | "video" | "image",
}