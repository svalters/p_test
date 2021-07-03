export interface QuizItem {
  id: number
  title: string
}

export interface QuizSubmit {
  correct: number
  total: number
}

export interface Answer {
  id?: number
  testId?: number
  questionId: number
  answerId: number
}

export interface Progress extends QuizSubmit {
  testId?: string
  lastQuestionId?: number
}

export interface Test {
  id?: string
  name: string
  quizId: number
  progress?: Progress
  answers?: Answer[]
}

export interface RouteParams {
  id: string
  quizId: string
}

export interface QuestionRouteParams extends RouteParams {
  questionId: string
}
