/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['vercel.com'], // Add any image domains you might need
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Configure webpack to handle binary files (for puppeteer/chrome-aws-lambda)
  webpack: (config) => {
    // This is needed for puppeteer-core and chrome-aws-lambda to work properly
    config.resolve.alias = {
      ...config.resolve.alias,
      // Fixes an issue with puppeteer-core requiring these modules
      'fs': false,
      'path': false,
    };
    return config;
  },
  // Increase serverless function timeout for OpenAI calls and PDF generation
  serverRuntimeConfig: {
    // Will only be available on the server side
    timeoutSeconds: 60, // Increase timeout for serverless functions
  },
  // Enable experimental features if needed
  experimental: {
    // Enable if you need streaming for OpenAI responses
    serverActions: true,
    // Optimize for serverless environment
    optimizeFonts: true,
  }
};

module.exports = nextConfig;
