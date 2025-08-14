import React, { useState, useRef, useCallback } from 'react';
import { Camera, Play, Pause, RotateCcw, Loader2, Eye } from 'lucide-react';
import axios from 'axios';
interface AnalysisResult {
  objects: string[];
  sceneDescription: string;
  confidence: number;
}

const VideoAnalyzer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
   const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

const captureFrame = async () => {
  const video = videoRef.current;
  if (!video) return;

  // Start analysis state
  setIsAnalyzing(true);
  setError('');
  setAnalysisResult(null);

  try {
    // Capture frame
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to Base64
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);

    // Send to backend for analysis
    // const response = await axios.post("http://localhost:5000/analyze-image", {
    //   image: imageData
    // });

    const response = await axios.post("https://ai-image-analyzer-1-i8su.onrender.com/analyze-image", {
      image: imageData
    });


    const result = response.data;
    setAnalysisResult(result);

  } catch (error) {
    setError(error instanceof Error ? error.message : 'Analysis failed');
    console.error("Upload error", error);
  } finally {
    setIsAnalyzing(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              AI Image Analyzer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Capture a snapshot of the video, and let AI analyze the objects and scene
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-600" />
                Video Player
              </h2>
            </div>
            
            <div className="p-6">
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                    <video
                      ref={videoRef}
                      src="assets\Watch India in 4K _ One-Minute Cinematic Travel Video _ India Places to Visit.mp4"
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />

                    {/* Capture button overlay */}
                    {(
                      <button
                        onClick={captureFrame}
                        className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full shadow-lg transition"
                      >
                        <Camera size={20} />
                      </button>
                    )}
                  </div>
                </div>
            </div>
          </div>

          {/* Analysis Results Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                Analysis Results
              </h2>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Analyzing video snapshot...</p>
                    <p className="text-sm text-gray-500">This may take a few moments</p>
                  </div>
                </div>
              )}

              {analysisResult && capturedImage && (
        <div className="mt-5 flex flex-col items-center bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-2">Preview Screenshot</h4>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-72 border-2 border-black rounded-lg"
          />
          </div>)}

              {analysisResult && (
                <div className="space-y-6">
                  {/* Scene Description */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Scene Description</h3>
                    <p className="text-blue-800 leading-relaxed">{analysisResult.sceneDescription}</p>
                  </div>

                  {/* Detected Objects */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-3">Detected Objects</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.objects.map((object, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-full"
                        >
                          {object}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Confidence Score</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-purple-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-purple-600 transition-all duration-500"
                          style={{ width: `${analysisResult.confidence}%` }}
                        />
                      </div>
                      <span className="text-purple-900 font-medium">
                        {analysisResult.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!analysisResult && !isAnalyzing && !error && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center text-gray-500">
                    <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">No analysis yet</p>
                    <p className="text-sm">Load a video and click "Capture & Analyze" to see results</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hidden canvas for snapshot capture */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default VideoAnalyzer;