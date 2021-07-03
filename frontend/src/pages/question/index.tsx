import React, { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"

import useTest from "@/hooks/useTest"
import useQuestions from "@/hooks/quiz/useQuestion"
import useProgress from "@/hooks/useProgress"
import { fetchSubmit } from "@/hooks/quiz/useSubmit"
import useToast from "@/hooks/useToast"
import Answers from "@/pages/question/Answers"
import ProgressBar from "@/components/ProgressBar"
import Loading from "@/components/Loading"
import { QuestionRouteParams, Answer } from "@/types"
import { ToastType } from "@/Toast"

const Question = () => {
  const history = useHistory()
  const { id, quizId, questionId } = useParams<QuestionRouteParams>()
  const addToast = useToast()

  const saveProgress = useProgress()
  const { data: test, isLoading, ...rest } = useTest({ id: String(id) })
  const { data: questions, isLoading: questionsAreLoading } = useQuestions({
    quizId: Number(quizId),
  })

  const findQuestionIndex = (questions || []).findIndex(
    question => question.id === Number(questionId)
  )
  const questionIndex = findQuestionIndex >= 0 ? findQuestionIndex : 0
  const lastQuestionId = test?.progress?.lastQuestionId
  const question = questionId
    ? questions?.[findQuestionIndex]
    : questions?.[lastQuestionId ?? 0]
  const nextQuestionId = questions?.[questionIndex + 1]?.id ?? question?.id

  const nextQuestion = () => {
    if (questionIndex >= (questions ?? []).length - 1) {
      history.push(`/${id}/quiz/${quizId}/result`)
    } else {
      history.push(`/${id}/quiz/${quizId}/question/${nextQuestionId}`)
    }
  }

  const onSubmit = (data: Pick<Answer, "answerId">) =>
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
            questionId: Number(questionId),
            lastQuestionId: nextQuestionId && Number(nextQuestionId),
          },
        })
      )
      .then(({ answerCorrect }) => {
        if (!answerCorrect) {
          addToast({ message: "Better luck next time!" })
        } else {
          addToast({ message: "Correct!", type: ToastType.success })
        }
      })
      .then(nextQuestion)

  /**
   * Redirect if quiz path isn't correct
   */
  useEffect(() => {
    const dataLoaded = !isLoading && !questionsAreLoading
    if (dataLoaded && (!test || (!question && !lastQuestionId))) {
      history.push("/")
    } else if (dataLoaded && !!test?.quizId && !question && !!lastQuestionId) {
      history.push(`/${id}/quiz/${test?.quizId}/question/${lastQuestionId}`)
    }
  }, [history, isLoading, questionsAreLoading])

  return (
    <>
      <div className='flex flex-grow items-end w-full h-full'>
        <Loading isLoading={questionsAreLoading}>
          <h2 className='!mt-0'>{question?.title}</h2>
        </Loading>
      </div>
      <div className='flex flex-grow items-start w-full h-full pt-12'>
        <Answers
          onSubmit={onSubmit}
          quizId={Number(quizId)}
          questionId={question?.id}
        />
      </div>
      <ProgressBar
        total={test?.progress?.total ?? 0}
        lastQuestionIndex={questionIndex}
      />
    </>
  )
}

export default Question
