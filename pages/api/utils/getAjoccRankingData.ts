import fetch from "node-fetch"
import { JSDOM } from "jsdom"

interface Props {
  ajoccCode: string
  year?: number
}

export const getAjoccRankingData = async (props: Props) => {
  console.log("invoke")
  const { ajoccCode, year } = props
  const targetYear = getCurrentSeasonYear()
  try {
    console.log("fech", `https://data.cyclocross.jp/racer/${ajoccCode}`)
    const riderPageResponse = await fetch(
      `https://data.cyclocross.jp/racer/${ajoccCode}`
    )
    const html = await riderPageResponse.text()
    const jsdom = new JSDOM(html)
    const dom = jsdom.window.document

    //RiderInfoのオブジェクトを作成する
    const racerInfoTable = dom.querySelector(
      "#results_contents_rider .individual_list"
    )
    const racerInfoKeys: string[] = []
    const racerInfoValues: string[] = []
    racerInfoTable?.querySelectorAll("dt").forEach((node) => {
      racerInfoKeys.push(node.textContent?.trim() ?? "")
    })
    racerInfoTable?.querySelectorAll("dd").forEach((node) => {
      racerInfoValues.push(node.textContent?.trim() ?? "")
    })
    const racerInfoData = Object.fromEntries(
      racerInfoKeys.map((racerInfoKey, index) => [
        racerInfoKey,
        racerInfoValues[index]
      ])
    )

    //AJOCCランク履歴の配列を作成する
    const ajoccRankingInfoKeys: string[] = []
    const ajoccRankingInfoValues: string[] = []
    dom.querySelectorAll("#ajocc_ranking dt").forEach((node) => {
      ajoccRankingInfoKeys.push(node.textContent?.trim() ?? "")
    })
    dom.querySelectorAll("#ajocc_ranking dd").forEach((node) => {
      ajoccRankingInfoValues.push(node.textContent?.trim() ?? "")
    })
    const ajoccRankingData = Array.from(
      ajoccRankingInfoKeys.map((rankingInfoKey, index) => ({
        season: rankingInfoKey,
        rank: ajoccRankingInfoValues[index]
      }))
    )

    //データを正規化
    const categoryRegExp = RegExp(
      "C1|C2|C3|C4|CM1|CM2|CM3|CL1|CL2|CL3|U17|CJ|U15/g"
    )
    const racerCategory = racerInfoData["カテゴリー"].match(categoryRegExp)
    const normalizeAjoccRankingData = ajoccRankingData.map(
      (seasonResult, index) => {
        const seasonCategory = seasonResult.season.match(categoryRegExp)
        return {
          season: seasonResult.season.slice(0, 7),
          category: seasonCategory !== null ? seasonCategory[0] : "Err",
          seasonRank: seasonResult.rank.slice(
            0,
            seasonResult.rank.indexOf("(") - 1
          ),
          seasonPoint: seasonResult.rank.slice(
            seasonResult.rank.indexOf("(") + 1,
            seasonResult.rank.indexOf("pt")
          )
        }
      }
    )

    const ajoccRacerData = {
      racerInfoData: {
        ajoccCode: ajoccCode,
        category: racerCategory !== null ? racerCategory[0] : "Err",
        name: racerInfoData.Name,
        team: racerInfoData["チーム"],
        jcfNo: racerInfoData["JCF No."]
      },
      ajoccRankingData: normalizeAjoccRankingData
    }

    return ajoccRacerData
  } catch (error) {
    console.error(error)
  }
}

const getCurrentSeasonYear = () => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const seasonYear = today.getMonth() < 11 ? currentYear : currentYear - 1
  return seasonYear
}
