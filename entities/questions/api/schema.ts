export type GetQuestionsResponse = {
  success: boolean;
  questions: Question[];
};

export type GetRandomQuestionResponse = {
  success: boolean;
  question: Question;
};

export type Question = {
  question_id: number;
  question_category: string;
  content: string;
};
