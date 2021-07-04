import { useQuery, UseQueryOptions } from "react-query"

import { get } from "@/utils"
import { QUIZ_URL } from "@/constants"
import { Answer, QuizSubmit } from "@/types"
import { queryClient } from "@/App"

interface SubmitParams {
  quizId: string | number
  answers: Pick<Answer, "answerId">[]
}

const parseAnswers = (answers: SubmitParams["answers"]) =>
  answers.map(answer => `answers[]=${answer.answerId}`).join("&")

/**
 * https://printful.com/test-quiz.php?action=submit&quizId=141&answers[]=57737&answers[]=262891
 */
export const submit = ({
  quizId,
  answers,
}: SubmitParams): Promise<QuizSubmit> => {
  const parsedAnswers = parseAnswers(answers)
  return get(`${QUIZ_URL}?action=submit&quizId=${quizId}&${parsedAnswers}`)
}

export const fetchSubmit = ({ quizId, answers }: SubmitParams) => {
  const parsedAnswers = parseAnswers(answers)
  return queryClient.fetchQuery(["submit", quizId, parsedAnswers], () =>
    submit({ quizId, answers })
  )
}

const useSubmit = (
  { quizId, answers }: SubmitParams,
  options?: UseQueryOptions<QuizSubmit>
) => {
  const parsedAnswers = parseAnswers(answers)
  return useQuery(
    ["submit", quizId, parsedAnswers],
    () => submit({ quizId, answers }),
    options
  )
}

export default useSubmit
