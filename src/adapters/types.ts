export interface ResourceHandle {
  backingId: string;
  title: string;
  description?: string;
  updated: string;
  space?: Space;
}

export interface FetchResult {
  content: string;
  etag: string;
  updated: string;
}

export interface SearchHit {
  backingId: string;
  snippet: string;
  score: number;
}

export type Space = 'ENG' | 'PRODUCT' | 'SEC';

export type Unsubscribe = () => void;

export interface SourceAdapter {
  readonly id: string;

  list(scope?: string): Promise<ResourceHandle[]>;

  fetch(backingId: string): Promise<FetchResult>;

  search(query: string, scope?: string): Promise<SearchHit[]>;

  onChange?(cb: (handle: ResourceHandle) => void): Unsubscribe;
}
