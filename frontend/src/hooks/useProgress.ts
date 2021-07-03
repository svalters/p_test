import { useMutation, useQueryClient } from "react-query"

import { post } from "@/utils"
import { API_URL } from "@/constants"
import { Answer, Progress } from "@/types"

interface ProgressParams {
  id: string
  data: Progress & Answer
}

export const saveProgress = ({
  id,
  data,
}: ProgressParams): Promise<{
  answerCorrect: boolean
  progress: Required<Progress>
  answer: Required<Answer>
}> => post(`${API_URL}/test/${id}/progress`, data)

const useProgress = () => {
  const queryClient = useQueryClient()

  return useMutation(saveProgress, {
    onSuccess: ({ progress, answer }) => {
      queryClient.setQueryData(["test", progress.testId], (test?: any) => {
        if (!test) {
          return undefined
        }
        return {
          ...test,
          progress: { ...test.progress, ...progress },
          answers: [...test.answers, answer],
        }
      })
    },
  })
}

export default useProgress
