import { VercelRequest, VercelResponse } from "@vercel/node"
import { createCanvas } from "canvas"

export default (request: VercelRequest, response: VercelResponse) => {
  const { ajoccCode, showRealName, showTeamName } = request.query

  if (ajoccCode === undefined) {
    response.status(400).send("'ajoccCode' is requied in the query string.")
  }

  const canvas = createCanvas(350, 165)
  const ctx = canvas.getContext("2d")
  ctx.fillText(`AJOCC Ranking`, 20, 20)

  const resultBuffer = canvas.toBuffer("image/png")

  response.setHeader("content-type", "image/png")
  response.status(200).send(resultBuffer)
}
