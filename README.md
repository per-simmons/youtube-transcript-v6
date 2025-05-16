# YouTube Transcript Downloader

A web application built with Next.js that allows users to fetch, view, and download transcripts from YouTube videos.

## Features

- Enter a YouTube URL and fetch the video transcript
- View the transcript with timestamps
- Copy the transcript to clipboard
- Download the transcript as a text file
- Responsive design for both desktop and mobile devices
- Dark mode support

## Technology Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **API**: Edge Runtime API Routes
- **Libraries**: youtube-transcript-plus

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## API Endpoints

### POST /api/transcript

Fetches a YouTube video transcript.

**Request Body**:
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response**:
```json
{
  "success": true,
  "transcript": "[00:00] Transcript content with timestamps",
  "segments": [{ "text": "Transcript content", "offset": 0, "duration": 5 }, ...]
}
```

**Error Responses**:
- 400: Invalid URL or missing URL
- 404: No transcript available
- 500: Server error

## Deployment

The application can be deployed to Vercel with zero configuration. Simply connect your GitHub repository to Vercel and deploy.

## License

MIT
