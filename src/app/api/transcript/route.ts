import { NextRequest, NextResponse } from "next/server";
import { fetchTranscript } from "youtube-transcript-plus";

export const runtime = "edge";

// The library returns this structure
type TranscriptResponse = Array<{
  text: string;
  duration: number;
  offset: number;
  // We handle start time explicitly
}>;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 }
      );
    }

    // Extract video ID from YouTube URL
    const videoIdMatch =
      url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/) ||
      [];
    const videoId = videoIdMatch[1];

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Fetch transcript using youtube-transcript-plus
    const transcript = await fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { error: "No transcript available for this video" },
        { status: 404 }
      );
    }

    // Create a formatted text version with timestamps
    const formattedText = transcript
      .map((segment) => {
        // offset is the start time in seconds
        const time = formatTime(segment.offset);
        return `[${time}] ${segment.text}`;
      })
      .join("\n");

    return NextResponse.json({
      success: true,
      transcript: formattedText,
      segments: transcript,
    });
  } catch (error: any) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch transcript",
        message: error.message || "Unknown error" 
      },
      { status: 500 }
    );
  }
}

// Helper function to format seconds into MM:SS format
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
} 