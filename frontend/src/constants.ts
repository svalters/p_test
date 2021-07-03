export const BASE_API_URL =
  (import.meta.env.VITE_API_URL as string) ?? "http://localhost:5000"
export const API_URL = `${BASE_API_URL}/api`

export const QUIZ_URL = "https://printful.com/test-quiz.php"
