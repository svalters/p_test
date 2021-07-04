import React, { useCallback, useEffect } from "react"
import { useHistory } from "react-router"
import { useForm } from "react-hook-form"

import useQuizzes from "@/hooks/quiz/useQuizzes"
import useStart from "@/hooks/useStart"
import { prefetchQuestions } from "@/hooks/quiz/useQuestion"
import Loading from "@/components/Loading"
import Button from "@/components/Button"
import { Test } from "@/types"
import { getName, setName } from "@/utils"

const Home: React.FC = () => {
  const history = useHistory()

  const { data, isLoading } = useQuizzes()
  const { mutateAsync } = useStart()

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: getName(),
      quizId: undefined,
    },
  })

  useEffect(() => {
    !isLoading && setFocus("name")
  }, [setFocus, isLoading])

  /**
   * Prefetch questions for less loading screen time
   */
  const quizId = watch("quizId")
  useEffect(() => {
    quizId && prefetchQuestions({ quizId: Number(quizId) })
  }, [quizId])

  const onSubmit = useCallback(
    (data: Test) =>
      mutateAsync(data).then(test => {
        setName(test.name)
        return history.push(`/${test?.id}/quiz/${test?.quizId}/question`)
      }),
    []
  )

  return (
    <Loading isLoading={isLoading}>
      {() => (
        <div className='flex flex-col justify-center items-center w-full'>
          <h1 className='!text-6xl text-center'>Quiz App</h1>
          <div className='max-w-sm w-full shadow-lg rounded p-6'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className='block'>
                <span className='text-gray-700'>Name *</span>
                <input
                  type='text'
                  placeholder='Enter your name'
                  className='w-full px-1 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black'
                  {...register("name", { required: true })}
                />
                <div className='mb-6 relative'>
                  {errors?.name?.type === "required" && (
                    <p className='absolute top-0 text-red-500 text-xs italic !mt-1'>
                      Name is required
                    </p>
                  )}
                </div>
              </label>

              <label className='block'>
                <span className='text-gray-700'>Choose quiz</span>
                <select
                  className='w-full px-1 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black'
                  {...register("quizId", { required: true })}
                >
                  {(data ?? []).map(({ id, title }) => (
                    <option key={id?.toString()} value={id}>
                      {title}
                    </option>
                  ))}
                </select>
              </label>

              <div className='flex flex-col mt-6'>
                <Button type='submit' disabled={isLoading || isSubmitting}>
                  Start
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Loading>
  )
}
export default Home
