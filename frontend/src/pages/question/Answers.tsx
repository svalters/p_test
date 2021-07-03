import React, { useEffect } from "react"
import { useForm } from "react-hook-form"

import useAnswers from "@/hooks/quiz/useAnswers"
import Loading from "@/components/Loading"
import Button from "@/components/Button"
import { Answer } from "@/types"

interface AnswersProps {
  onSubmit: (data: Answer) => void
  quizId: number
  questionId?: number
}

const Answers: React.FC<AnswersProps> = ({ onSubmit, quizId, questionId }) => {
  const { data: answers, isLoading } = useAnswers(
    {
      quizId: Number(quizId),
      questionId: Number(questionId),
    },
    { enabled: !!questionId }
  )

  const {
    handleSubmit,
    register,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm({
    mode: "onChange",
  })

  useEffect(() => {
    reset()
  }, [reset, questionId])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full h-full flex flex-col'
    >
      <Loading isLoading={isLoading || isSubmitting}>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-6 w-full'>
          {(answers ?? []).map(option => (
            <div
              key={option.id.toString()}
              className='rounded shadow-lg w-full my-2'
            >
              <label className='flex items-center cursor-pointer'>
                <div className='bg-gray-200 flex p-4'>
                  <input
                    type='radio'
                    value={option.id.toString()}
                    {...register(`answerId`, { required: true })}
                  />
                </div>
                <span className='ml-4'>{option.title}</span>
              </label>
            </div>
          ))}
        </div>
      </Loading>

      <div className='flex flex-grow' />

      <div className='flex flex-col pt-12'>
        <Button type='submit' disabled={isLoading || !isDirty || isSubmitting}>
          Submit Answer
        </Button>
      </div>
    </form>
  )
}

export default Answers
