import React, { useEffect } from "react"
import { useHistory } from "react-router"
import { useForm } from "react-hook-form"

import useQuizzes from "@/hooks/quiz/useQuizzes"
import useStart from "@/hooks/useStart"
import Loading from "@/components/Loading"
import Button from "@/components/Button"
import { Test } from "@/types"

const Home: React.FC = () => {
  const history = useHistory()

  const { data, isLoading } = useQuizzes()
  const { mutateAsync } = useStart()

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    mode: "onChange",
  })

  useEffect(() => {
    !isLoading && setFocus("name")
  }, [setFocus, isLoading])

  const onSubmit = (data: Test) =>
    mutateAsync(data).then(test =>
      history.push(`/${test?.id}/quiz/${test?.quizId}/question`)
    )

  return (
    <Loading isLoading={isLoading}>
      <div className='max-w-sm shadow-lg rounded p-6'>
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
            <Button
              type='submit'
              disabled={isLoading || !isDirty || isSubmitting}
            >
              Start
            </Button>
          </div>
        </form>
      </div>
    </Loading>
  )
}
export default Home
