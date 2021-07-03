import express from "express"
import path from "path"

import router from "./api"

const app = express()
const port = process.env.PORT || 5000

app.use("/api", router)

app.use(express.static(path.resolve(__dirname, "../frontend/dist")))
app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"))
})

app.listen(port, () => {
  console.log(`Server started: http://localhost:${port}`)
})
