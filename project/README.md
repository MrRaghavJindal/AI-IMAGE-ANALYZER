# YouTube AI Video Analyzer

A modern web application that captures snapshots from YouTube videos and analyzes them using Google's Gemini AI to detect objects and describe scenes.

## Features

- 🎥 **YouTube Video Integration**: Enter any YouTube URL and embed the video
- 📸 **Snapshot Capture**: Capture frames from videos using HTML5 canvas
- 🤖 **AI-Powered Analysis**: Use Gemini AI to analyze images for:
  - Object detection and identification
  - Scene description and context
  - Confidence scoring
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- ⚡ **Real-time Results**: Get instant analysis results with loading states

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions
- **AI**: Google Gemini 1.5 Flash
- **Icons**: Lucide React
- **Build Tool**: Vite

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini AI
3. Copy the API key for use in environment variables

### 2. Configure Environment Variables

You'll need to set up your Gemini API key in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to Settings > Edge Functions
3. Add the following environment variable:
   - `GEMINI_API_KEY`: Your Google AI Studio API key

### 3. Deploy Edge Function

The edge function will be automatically deployed when you connect to Supabase.

### 4. Run the Application

```bash
npm run dev
```

## How to Use

1. **Enter YouTube URL**: Paste any valid YouTube video URL in the input field
2. **Load Video**: The video will automatically embed and load
3. **Capture & Analyze**: Click the "Capture & Analyze" button to:
   - Take a snapshot of the current video frame
   - Send it to the AI for analysis
   - Display results including objects detected and scene description

## Supported YouTube URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

## API Endpoints

### POST `/functions/v1/analyze-video`

Analyzes a base64-encoded image using Gemini AI.

**Request Body:**
```json
{
  "imageData": "base64-encoded-image-data"
}
```

**Response:**
```json
{
  "objects": ["person", "car", "building"],
  "sceneDescription": "A person walking down a busy city street with cars and buildings in the background",
  "confidence": 92
}
```

## Technical Notes

- **Cross-Origin**: Uses HTML5 canvas for video frame capture
- **Rate Limiting**: Gemini API has usage limits, check Google's documentation
- **Image Format**: Captures are converted to JPEG with 80% quality
- **Security**: API keys are stored securely in Supabase environment variables

## Troubleshooting

### Common Issues

1. **"Gemini API key not configured"**
   - Ensure GEMINI_API_KEY is set in Supabase environment variables

2. **Video won't load**
   - Check if the YouTube URL is valid and public
   - Some videos may have embedding restrictions

3. **Analysis fails**
   - Verify your Gemini API key has sufficient quota
   - Check network connectivity

### Error Handling

The application includes comprehensive error handling for:
- Invalid YouTube URLs
- Network connectivity issues
- API rate limiting
- Malformed responses

## Performance Considerations

- Video snapshots are captured at 80% JPEG quality for optimal balance of size and clarity
- Analysis results are cached during the session
- Edge functions provide fast, global response times

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.