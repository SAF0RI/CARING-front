import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getQuestions, getRandomQuestion } from "./handler";

export const questionsQueries = createQueryKeys("questions", {
  questionList: {
    queryKey: null,
    queryFn: () => getQuestions(),
  },
  randomQuestion: {
    queryKey: ["random"],
    queryFn: () => getRandomQuestion(),
  },
});
