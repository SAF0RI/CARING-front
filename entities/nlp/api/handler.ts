import { PostAxiosInstance } from "@/shared/axios/axios.method";
import {
  AnalyzeComprehensiveResponse,
  EntitiesResponse,
  NLPRequestBase,
  SentimentResponse,
  SyntaxResponse,
} from "./schema";

const withLang = (params: Pick<NLPRequestBase, "language_code">) =>
  params.language_code ? `&language_code=${encodeURIComponent(params.language_code)}` : "";

export const analyzeSentiment = async (
  params: NLPRequestBase
): Promise<SentimentResponse> => {
  const response = await PostAxiosInstance<SentimentResponse>(
    `/nlp/sentiment?text=${encodeURIComponent(params.text)}${withLang(params)}`
  );
  return response.data;
};

export const extractEntities = async (
  params: NLPRequestBase
): Promise<EntitiesResponse> => {
  const response = await PostAxiosInstance<EntitiesResponse>(
    `/nlp/entities?text=${encodeURIComponent(params.text)}${withLang(params)}`
  );
  return response.data;
};

export const analyzeSyntax = async (
  params: NLPRequestBase
): Promise<SyntaxResponse> => {
  const response = await PostAxiosInstance<SyntaxResponse>(
    `/nlp/syntax?text=${encodeURIComponent(params.text)}${withLang(params)}`
  );
  return response.data;
};

export const analyzeTextComprehensive = async (
  params: NLPRequestBase
): Promise<AnalyzeComprehensiveResponse> => {
  const response = await PostAxiosInstance<AnalyzeComprehensiveResponse>(
    `/nlp/analyze?text=${encodeURIComponent(params.text)}${withLang(params)}`
  );
  return response.data;
};

