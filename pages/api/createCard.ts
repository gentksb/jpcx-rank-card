import { VercelRequest, VercelResponse } from "@vercel/node"
import { createCanvas, loadImage, registerFont } from "canvas"
import { getAjoccRankingData } from "./utils/getAjoccRankingData"

export default async (request: VercelRequest, response: VercelResponse) => {
  const { ajoccCode, showRealName, showTeamName } = request.query
  const timestamp = new Date()
  const timeRecord = `${timestamp.getUTCFullYear()}.${timestamp.getMonth()}.${timestamp.getDate()}`

  const colorMap = {
    C1: "#f56565",
    C2: "#ed8936",
    C3: "#48bb78",
    CM1: "#ed64a6",
    CM2: "#9f7aea",
    CM3: "#667eea",
    L1: "#f56565",
    L2: "#ed8936"
  }

  if (ajoccCode === undefined) {
    response.status(400).send("'ajoccCode' is requied in the query string.")
    return
  }
  if (typeof ajoccCode === "object") {
    response.status(400).send("'ajoccCode' is must be single parameter")
    return
  } else {
    const racerData = await getAjoccRankingData({ ajoccCode: ajoccCode })
    if (racerData === undefined) {
      response.status(400).send("Invalid AJOCC Code")
      return
    } else {
      registerFont("./assets/NotoSans-Regular.ttf", {
        family: "Noto Sans"
      })

      const canvas = createCanvas(350, 165)
      const ctx = canvas.getContext("2d")
      console.log(racerData)
      //背景
      ctx.fillStyle = "#fafaf6"
      ctx.fillRect(0, 0, 350, 165)

      //背景円
      // @ts-ignore
      ctx.fillStyle = colorMap[racerData?.racerInfoData.category] ?? "#38b2ac"
      // @ts-ignore
      ctx.strokeStyle = colorMap[racerData?.racerInfoData.category] ?? "#38b2ac"
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.arc(80, 100, 45, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fill()

      if (racerData.ajoccRankingData[0].seasonRank === "1") {
        const crownImage = await loadImage("./assets/crown.svg")
        ctx.drawImage(crownImage, 185, 40, 120, 120)
      } else {
        const rankImage = await loadImage("./assets/rank.svg")
        ctx.drawImage(rankImage, 195, 40, 120, 120)
      }

      //文字
      const titleFontStyle = {
        font: 'bold 30px "Noto Sans"'
      }
      const bodyFontStyle = {
        font: 'bold 18px "Noto Sans"'
      }
      const rankingFontStyle = {
        font: 'bold 44px "Noto Sans"'
      }
      const memoFontStyle = {
        font: 'thin 8px "Noto Sans"'
      }
      ctx.fillStyle = "#6f6f6f"
      ctx.font = titleFontStyle.font
      ctx.fillText(`AJOCC RIDER DATA`, 15, 40)
      ctx.font = memoFontStyle.font
      ctx.fillText(
        `AJOCC CODE: ${racerData.racerInfoData.ajoccCode} at ${timeRecord}`,
        10,
        160
      )
      ctx.fillStyle = "#111111"
      ctx.font = bodyFontStyle.font
      ctx.fillText(`Category`, 35, 80)
      ctx.fillText(`Ranking`, 200, 80)
      ctx.font = rankingFontStyle.font
      ctx.fillText(`${racerData?.racerInfoData.category}`, 50, 120)
      ctx.fillText(`${racerData?.ajoccRankingData[0].seasonRank}`, 230, 120)

      const resultBuffer = canvas.toBuffer("image/png")

      response.setHeader("content-type", "image/png")
      response.status(200).send(resultBuffer)
    }
  }
}
