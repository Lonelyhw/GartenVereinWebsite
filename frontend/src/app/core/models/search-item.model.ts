export type SearchItemType =
  | 'page'
  | 'news'
  | 'notice'
  | 'document'
  | 'board'
  | 'rental'
  | 'garden'
  | 'event'
  | 'clubhouse';

export interface SearchItem {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle?: string;
  text: string;
  route: any[];
  date?: string;
}