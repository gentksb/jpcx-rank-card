import { VercelRequest, VercelResponse } from "@vercel/node"
import { createCanvas } from "canvas"
import { getAjoccRankingData } from "./utils/getAjoccRankingData"

export default async (request: VercelRequest, response: VercelResponse) => {
  const { ajoccCode, showRealName, showTeamName } = request.query

  if (ajoccCode === undefined) {
    response.status(400).send("'ajoccCode' is requied in the query string.")
    return
  }
  if (typeof ajoccCode === "object") {
    response.status(400).send("'ajoccCode' is must be single parameter")
    return
  } else {
    const racerData = await getAjoccRankingData({ ajoccCode: ajoccCode })
    const canvas = createCanvas(350, 165)
    const ctx = canvas.getContext("2d")
    const titleFontStyle = {
      font: 'bold 32px "Noto Sans CJK JP"'
    }
    const bodyFontStyle = {
      font: 'bold 18px "Noto Sans CJK JP"'
    }
    ctx.font = titleFontStyle.font
    ctx.fillText(`AJOCC Rider Data`, 20, 40)
    ctx.font = bodyFontStyle.font
    ctx.fillText(`Category : ${racerData?.racerInfoData["カテゴリー"]}`, 20, 80)
    console.log(racerData)
    ctx.fillText(
      `最新ランキング : ${racerData?.ajoccRankingData[0].rank}`,
      20,
      100
    )

    const resultBuffer = canvas.toBuffer("image/png")

    response.setHeader("content-type", "image/png")
    response.status(200).send(resultBuffer)
  }
}
