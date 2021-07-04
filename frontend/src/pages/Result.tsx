import React, { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"

import { jsConfetti } from "@/App"
import useStart from "@/hooks/useStart"
import useTest from "@/hooks/useTest"
import Loading from "@/components/Loading"
import Button from "@/components/Button"
import { RouteParams } from "@/types"

const confettiConfig = {
  emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸", "🦄"],
  emojiSize: 50,
}

const Result: React.FC = () => {
  const history = useHistory()
  const { id } = useParams<RouteParams>()

  const { data: test, isLoading } = useTest({ id })
  const testPassed =
    !isLoading && test?.progress?.correct === test?.progress?.total

  const { mutateAsync } = useStart()
  const onTestReset = () => {
    if (test?.quizId && test?.name) {
      mutateAsync(test).then(({ id, quizId }) =>
        history.push(`/${id}/quiz/${quizId}/question`)
      )
    }
  }

  useEffect(() => {
    if (testPassed) {
      jsConfetti.addConfetti(confettiConfig)
      const interval = setInterval(() => {
        jsConfetti.addConfetti(confettiConfig)
      }, 2 * 1000)

      return () => clearInterval(interval)
    }
  }, [testPassed])

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
      {() => (
        <div className='flex flex-col justify-center'>
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
        </div>
      )}
    </Loading>
  )
}

export default Result
