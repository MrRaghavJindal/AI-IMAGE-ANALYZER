export interface AnalysisResult {
  objects: string[];
  sceneDescription: string;
  confidence: number;
}

export interface VideoAnalyzerProps {
  className?: string;
}