/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = withBundleAnalyzer({
  enabled: process.env.NEXT_PUBLIC_ANALYZE==='true',  // Enable analysis when ANALYZE env variable is true
});

export default {
    ...nextConfig,
    images: {
    domains: ['loopster1.s3.amazonaws.com'],  // Allow images from your S3 bucket
    },
};
