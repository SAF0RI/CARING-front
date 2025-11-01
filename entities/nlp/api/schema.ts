export interface NLPRequestBase {
  text: string;
  language_code?: string; // default 'ko'
}

export type SentimentResponse = Record<string, any>;
export type EntitiesResponse = Record<string, any>;
export type SyntaxResponse = Record<string, any>;
export type AnalyzeComprehensiveResponse = Record<string, any>;

