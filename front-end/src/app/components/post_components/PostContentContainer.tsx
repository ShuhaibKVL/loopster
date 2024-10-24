import React, { useEffect, useRef, useState } from 'react';
import PostFooter from './PostFooter';
import { PostContentProps } from '@/app/utils/interfaces/PostContentProps';
import PostIMageSkelton from '../skeltons/PostIMageSkelton';
import Image from 'next/image';
import { dateToDays , dateToHours , dateToMinutes } from '@/lib/utils/convertDateDifference';

const PostContentContainer: React.FC<PostContentProps> = ({ mediaUrl, mediaType, content, time }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isInViewPort, setIsInViewport] = useState(false);
  const [imgError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (video) {
            if (entry.isIntersecting) {
              video.play();
              setIsInViewport(true);
            } else {
              video.pause();
              setIsInViewport(false);
            }
          }
        });
      },
      {
        threshold: 0.5, // 50% of the video should be visible to trigger play
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleImgError = () => {
    setImageError(true);
  };

  return (
    <div className="relative mx-auto w-full p-4 border rounded-lg shadow-lg bg-[var(--secondary-bg)]">
      {mediaType === 'image' ? (
        mediaUrl && !imgError ? (
          <Image
            src={`${mediaUrl}`}
            alt="Postcard Image"
            className="w-full h-auto rounded-lg"
            onError={handleImgError}
            width={700}
            height={500}
            layout="responsive"
            placeholder='blur'
          />
        ) : (
          <PostIMageSkelton />
        )
      ) : mediaType === 'video' ? (
        mediaUrl && !imgError ? (
          <video
            src={`${mediaUrl}`}
            ref={videoRef}
            className="w-full h-auto rounded-md"
            autoPlay
            loop
            muted
            controls
            playsInline
          />
        ) : (
          <PostIMageSkelton />
        )
      ) : (
        ''
      )}
      <div className="mt-4 flex items-start justify-between">
        <p
          className="text-gray-800 text-base"
          dangerouslySetInnerHTML={{ __html: content }}
        ></p>
        <p className="mt-2 text-gray-500 text-sm">
          {dateToDays(time as Date) > 0 ? 
          `${dateToDays(time as Date)} day ago`:
          (dateToHours(time as Date) > 0 ?
          `${(dateToHours(time as Date))} hour ago` :
          (dateToMinutes(time as Date) > 0 ? 
          `${(dateToMinutes(time as Date))} minutes ago`:
          ('just now')))}
        </p>
      </div>
      <PostFooter />
    </div>
  );
};

export default PostContentContainer;
