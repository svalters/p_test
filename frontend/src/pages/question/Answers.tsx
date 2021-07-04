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
  questionTitle?: string
}

const Answers: React.FC<AnswersProps> = ({
  onSubmit,
  quizId,
  questionId,
  questionTitle,
}) => {
  const { data: answers } = useAnswers(
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
    formState: { isSubmitting, isValid, isDirty },
  } = useForm({
    mode: "onChange",
  })

  useEffect(() => {
    questionId && reset()
  }, [reset, questionId])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col h-full w-full'
    >
      <div className='flex flex-1'>
        <Loading isLoading={!answers?.length || isSubmitting}>
          {() => (
            <div className='flex flex-col justify-center flex-1'>
              <h2 className='!mt-0 lg:pb-12'>{questionTitle}</h2>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-6 w-full'>
                {(answers ?? []).map(option => (
                  <div
                    key={option.id.toString()}
                    className='w-full my-2 overflow-hidden rounded shadow-lg focus-within:ring-2'
                  >
                    <label className='flex cursor-pointer'>
                      <div className='flex self-start bg-gray-200 p-4'>
                        <input
                          type='radio'
                          value={option.id.toString()}
                          {...register(`answerId`, { required: true })}
                        />
                      </div>
                      <div className='flex items-center pl-4'>
                        <p className='!m-0'>{option.title}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Loading>
      </div>

      <div className='flex flex-col py-6'>
        <Button type='submit' disabled={!isValid || !isDirty || isSubmitting}>
          Submit Answer
        </Button>
      </div>
    </form>
  )
}

export default React.memo(Answers)
