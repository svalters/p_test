import { useQuery, UseQueryOptions } from "react-query"

import { get } from "@/utils"
import { QUIZ_URL } from "@/constants"
import { QuizItem } from "@/types"

/**
 * https://printful.com/test-quiz.php?action=quizzes
 */
export const fetchQuizzes = (): Promise<QuizItem[]> =>
  get(`${QUIZ_URL}?action=quizzes`)

const useQuizzes = (options?: UseQueryOptions<QuizItem[]>) =>
  useQuery("quizzes", fetchQuizzes, options)

export default useQuizzes
