export interface NewsPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  published: boolean;
}