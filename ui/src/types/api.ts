export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  goal: string;
  currentTask: string;
  thinking: string;
  confidence: number;
  progress: number;
  tools: string[];
}

export interface ApiError {
  detail: string;
}
