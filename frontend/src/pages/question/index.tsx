import React, { useCallback, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"

import useTest from "@/hooks/useTest"
import useQuestions from "@/hooks/quiz/useQuestion"
import useProgress from "@/hooks/useProgress"
import { fetchSubmit } from "@/hooks/quiz/useSubmit"
import { prefetchAnswers } from "@/hooks/quiz/useAnswers"
import useToast from "@/hooks/useToast"
import Answers from "@/pages/question/Answers"
import ProgressBar from "@/components/ProgressBar"
import { QuestionRouteParams, Answer } from "@/types"
import { ToastType } from "@/Toast"

const Question = () => {
  const { id, quizId, questionId } = useParams<QuestionRouteParams>()
  const history = useHistory()
  const addToast = useToast()

  const saveProgress = useProgress()
  const { data: test, isLoading } = useTest({ id: String(id) })
  const { data: questions, isLoading: questionsAreLoading } = useQuestions({
    quizId: Number(quizId),
  })

  const questionIndex = questionId
    ? (questions ?? []).findIndex(
        question => question.id === Number(questionId)
      )
    : 0

  const question = questions?.[questionIndex]
  const lastQuestionId = test?.progress?.lastQuestionId
  const nextQuestionId = questions?.[questionIndex + 1]?.id

  const nextQuestion = useCallback(() => {
    if (nextQuestionId) {
      return history.push(`/${id}/quiz/${quizId}/question/${nextQuestionId}`)
    }
    return history.push(`/${id}/quiz/${quizId}/result`)
  }, [id, quizId, nextQuestionId])

  const onSubmit = useCallback(
    (data: Pick<Answer, "answerId">) =>
      fetchSubmit({
        quizId: String(quizId),
        answers: [...(test?.answers ?? []), { answerId: data.answerId }],
      })
        .then(progress =>
          saveProgress.mutateAsync({
            id: String(id),
            data: {
              ...data,
              ...progress,
              questionId: Number(question?.id),
              lastQuestionId: (nextQuestionId && Number(nextQuestionId)) ?? -1,
            },
          })
        )
        .then(({ answerCorrect }) => {
          answerCorrect
            ? addToast({ message: "Correct!", type: ToastType.success })
            : addToast({ message: "Better luck next time!" })
        })
        .then(nextQuestion),
    [quizId, nextQuestionId, test?.answers, question?.id]
  )

  /**
   * Prefetch next answers for less loading screen time
   */
  useEffect(() => {
    quizId &&
      nextQuestionId &&
      prefetchAnswers({ quizId: Number(quizId), questionId: nextQuestionId })
  }, [quizId, nextQuestionId])

  /**
   * Redirect if quiz path isn't correct
   */
  useEffect(() => {
    const dataLoaded = !isLoading && !questionsAreLoading
    if (dataLoaded) {
      if (lastQuestionId === -1) {
        history.push(`/${id}/quiz/${quizId}/result`)
      } else if (!test || (!question && !lastQuestionId)) {
        history.push("/")
      } else if (lastQuestionId && lastQuestionId !== question?.id) {
        history.push(`/${id}/quiz/${test?.quizId}/question/${lastQuestionId}`)
      }
    }
  }, [
    history,
    isLoading,
    questionsAreLoading,
    id,
    quizId,
    test,
    question,
    lastQuestionId,
  ])

  return (
    <>
      <Answers
        onSubmit={onSubmit}
        quizId={Number(quizId)}
        questionId={question?.id}
        questionTitle={question?.title}
      />
      <ProgressBar
        total={test?.progress?.total ?? 0}
        lastQuestionIndex={Math.max(questionIndex, 0)}
      />
    </>
  )
}

export default Question
