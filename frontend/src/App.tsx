import React from "react"
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import JSConfetti from "js-confetti"

import ToastProvider from "@/Toast"
import Home from "@/pages"
import Question from "@/pages/question"
import Result from "@/pages/Result"

export const jsConfetti = new JSConfetti()

/**
 * Let's relay on cache
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 1000 * 60 * 30,
    },
  },
})

function App() {
  return (
    <div className='!container prose lg:prose-xl mx-auto min-h-full flex'>
      <div className='flex flex-1 flex-col justify-center items-center p-6 sm:py-16'>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ToastProvider>
            <Router>
              <Switch>
                <Route path='/' component={Home} exact />
                <Route
                  path='/:id/quiz/:quizId/question/:questionId?'
                  component={Question}
                  exact
                />
                <Route
                  path='/:id/quiz/:quizId/result'
                  component={Result}
                  exact
                />
                <Redirect to='/' />
              </Switch>
            </Router>
          </ToastProvider>
        </QueryClientProvider>
      </div>
    </div>
  )
}

export default App
