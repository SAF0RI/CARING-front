import { GetAxiosInstance } from "@/shared/axios/axios.method";
import { GetQuestionsResponse, GetRandomQuestionResponse } from "./schema";

export const getQuestions = async (): Promise<GetQuestionsResponse> => {
  const response = await GetAxiosInstance<GetQuestionsResponse>("/questions");
  return response.data;
};

export const getRandomQuestion = async (): Promise<GetRandomQuestionResponse> => {
  const response = await GetAxiosInstance<GetRandomQuestionResponse>(
    "/questions/random"
  );
  return response.data;
};

