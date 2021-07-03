import { useQuery, UseQueryOptions } from "react-query"

import { get } from "@/utils"
import { QUIZ_URL } from "@/constants"
import { QuizItem } from "@/types"

interface AnswerParams {
  quizId: string | number
  questionId: string | number
}

/**
 * https://printful.com/test-quiz.php?action=answers&quizId=141&questionId=3193
 */
export const fetchAnswers = ({
  quizId,
  questionId,
}: AnswerParams): Promise<QuizItem[]> =>
  get(`${QUIZ_URL}?action=answers&quizId=${quizId}&questionId=${questionId}`)

const useAnswers = (
  { quizId, questionId }: AnswerParams,
  options?: UseQueryOptions<QuizItem[]>
) =>
  useQuery(
    ["answers", quizId, questionId],
    () => fetchAnswers({ quizId, questionId }),
    options
  )

export default useAnswers
