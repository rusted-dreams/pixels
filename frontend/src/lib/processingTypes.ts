export interface WorkerRequest {
  endpoint: string;
  images: ImageData[];
  params: Record<string, string | number>;
}

export interface WorkerResponse {
  images?: Array<{ name: string; image: ImageData }>;
  zip?: boolean;
  error?: string;
}
