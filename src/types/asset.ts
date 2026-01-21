export interface Asset {
  id: string;
  url: string;
  path: string;
  type: 'image' | 'video';
  size: number;
  hash: string;
  fileName: string;
  mimeType: string;
  width?: number;
  height?: number;
  createdAt: Date;
  usedIn: string[]; // Array of project IDs using this asset
}

export interface AssetUploadResult {
  asset: Asset;
  wasReused: boolean;
}
