import React, { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"

import useStart from "@/hooks/useStart"
import useTest from "@/hooks/useTest"
import Loading from "@/components/Loading"
import Button from "@/components/Button"
import { RouteParams } from "@/types"

const Result: React.FC = () => {
  const history = useHistory()
  const { id } = useParams<RouteParams>()

  const { data: test, isLoading } = useTest({ id })

  const { mutateAsync } = useStart()
  const onTestReset = () => {
    if (test?.quizId && test?.name) {
      mutateAsync(test).then(({ id, quizId }) =>
        history.push(`/${id}/quiz/${quizId}/question`)
      )
    }
  }

  /**
   * Redirect if quiz path isn't correct
   */
  useEffect(() => {
    if (!isLoading && !test) {
      history.push("/")
    }
  }, [history, isLoading])

  return (
    <Loading isLoading={isLoading}>
      <h1 className='text-center'>Thanks, {test?.name}!</h1>

      <p className='text-center'>
        You responded correctly to {test?.progress?.correct} out of{" "}
        {test?.progress?.total} questions
      </p>

      <div className='flex justify-center'>
        <div className='mx-3'>
          <Button onClick={onTestReset}>Retry</Button>
        </div>

        <div className='mx-3'>
          <Button onClick={() => history.push("/")}>Next Quiz</Button>
        </div>
      </div>
    </Loading>
  )
}

export default Result
