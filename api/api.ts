import express, { Request, Response } from "express"
import { Answer, PrismaClient, Progress, Test } from "@prisma/client"
import cors from "cors"

const prisma = new PrismaClient()
const router = express.Router()

router.use(cors())
router.use(express.json())

/**
 * Start new test
 */
router.post("/test", async (req: Request, res: Response) => {
  const requestBody: Pick<Test, "name" | "quizId"> = req.body

  const test = await prisma.test.create({
    data: {
      name: String(requestBody.name),
      quizId: Number(requestBody.quizId),
      progress: {
        create: {},
      },
    },
    include: { progress: true, answers: true },
  })

  res.json(test)
})

/**
 * Return test data by id
 */
router.get("/test/:id", async (req: Request, res: Response) => {
  const test = await prisma.test.findUnique({
    where: {
      id: String(req.params.id),
    },
    include: { progress: true, answers: true },
  })

  res.json(test)
})

/**
 * Save answer info
 */
const saveAnswer = async (req: Request) => {
  const requestBody: Pick<Answer, "questionId" | "answerId"> = req.body

  const answer = await prisma.answer.create({
    data: {
      testId: String(req.params.id),
      questionId: Number(requestBody.questionId),
      answerId: Number(requestBody.answerId),
    },
  })

  return answer
}

/**
 * Save progress info
 */
const saveProgress = async (req: Request) => {
  const requestBody: Pick<Progress, "correct" | "total" | "lastQuestionId"> =
    req.body
  const testId = String(req.params.id)

  const prevProgress = await prisma.progress.findUnique({
    where: { testId },
  })

  const total = Number(requestBody.total)
  const lastQuestionId = Number(requestBody.lastQuestionId)
  const correct = Number(requestBody.correct)

  const prevCorrect = prevProgress ? prevProgress.correct : 0

  const progress = await prisma.progress.upsert({
    where: { testId },
    create: {
      testId,
      correct,
      total,
      lastQuestionId,
    },
    update: {
      correct,
      total,
      lastQuestionId,
    },
  })

  return { answerCorrect: prevCorrect < correct, progress }
}

/**
 * Save progress with answer & return if question was answered correctly with save data
 */
router.post("/test/:id/progress", async (req: Request, res: Response) => {
  const answer = await saveAnswer(req)
  const progress = await saveProgress(req)

  return res.json({ ...progress, answer })
})

export default router
