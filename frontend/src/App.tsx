import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import ToastProvider from "@/Toast"
import Home from "@/pages"
import Question from "@/pages/question"
import Result from "@/pages/Result"

function App() {
  return (
    <div className='!container prose lg:prose-xl h-full w-full mx-auto flex flex-col flex-grow flex-shrink-0 items-center justify-center py-16 px-4'>
      <ToastProvider>
        <Router>
          <Switch>
            <Route path='/' component={Home} exact />
            <Route
              path='/:id/quiz/:quizId/question/:questionId?'
              component={Question}
              exact
            />
            <Route path='/:id/quiz/:quizId/result' component={Result} exact />
          </Switch>
        </Router>
      </ToastProvider>
    </div>
  )
}
export default App
