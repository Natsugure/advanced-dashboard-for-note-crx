import { useState } from "react"
import { useApiClient } from "./useApiClient"
import { useUser } from "./useUsers"
import { fetchArticles, fetchCurrentUser, fetchStats } from "@/lib/noteApi"
import type { Articles, Stats } from "@/lib/noteApiSchema"
import type { UpdateStatsRequestBody } from "@/types"
import dayjs, { Dayjs } from "dayjs"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

type NoteStatsResponse = Stats["note_stats"]
type NoteArticlesResponse = Articles["notes"]
interface UpdateStatsRequest {
  params: {
    noteArticleId: number
  },
  body: UpdateStatsRequestBody
}

type Result = "success" | "no_update" | "no_article"

/** API処理の手番。 */
const phases = {
  stats:    1,
  articles: 2,
  post:     3,
  total:    3,

  start(phase: number) { return (phase - 1) / this.total * 100 },
  end(phase: number)   { return phase / this.total * 100 },
  range(phase: number) { return this.end(phase) - this.start(phase) },
} as const

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function useUpdateStats() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const api = useApiClient()
  const { fetchUser } = useUser()

  const updateStats = async (): Promise<Result> => {
    setProgress(0)
    setIsProcessing(true)

    const statsResponse: NoteStatsResponse = []
    const articlesResponse: NoteArticlesResponse = []
    let lastCalculatedAt: Dayjs | undefined = undefined

    try {
      const ad4nUser = await fetchUser()
      if (!ad4nUser) {
        throw new Error("user not found")
      }
      const noteSessionUser = await fetchCurrentUser()

      if (ad4nUser.noteUserId !== noteSessionUser.id) {
        throw new Error("user mismatch")
      }

      const articleCount = noteSessionUser.note_count

      if (articleCount === 0) {
        return "no_article"
      }

      const statsPerPage = 10
      const statsTotalPage = Math.ceil(articleCount / statsPerPage)

      for (let i = 1; i <= statsTotalPage; i++) {
        console.log(`fetchStats: Page ${i}`)
        const res = await fetchStats(i)

        if (i === 1) {
          lastCalculatedAt = dayjs.tz(res.last_calculate_at, "Asia/Tokyo").utc()
          // 前回取得時から更新されていなかったら処理を抜ける
          if (lastCalculatedAt <= dayjs(ad4nUser.lastNoteCalculatedAt)) {
            console.log("stats not updated")
            return "no_update"
          }
        }

        statsResponse.push(...res.note_stats)

        setProgress(calculateProgress(phases.stats, statsTotalPage, i))

        if (i < statsTotalPage) await sleep(500)
      }
      
      // note_listには下書きも含まれていて、currentUserのnote_countと値が異なる。
      // そのため、note_listの応答に含まれるtotalCountの値とisLastPageのフラグを使って制御する。
      const articlePerPage = 16
      let page = 1
      let articleTotalPages = 0
      while (true) {
        const res = await fetchArticles(page)
        articlesResponse.push(...res.notes)

        if (page === 1) {
          articleTotalPages = Math.ceil(res.totalCount / articlePerPage)
        }
        setProgress(calculateProgress(phases.articles, articleTotalPages, page))

        if (res.isLastPage) break
        page++
        await sleep(500)
      }

      const requestBody: UpdateStatsRequest[] = statsResponse.flatMap(item => {
        const article = articlesResponse.find(a => a.id === item.id)
        if (!article || !article.publishAt) return []

        return [{
          params: {
            noteArticleId: item.id
          },
          body: {
            article: {
              title: item.name,
              key: item.key,
              publishedAt: dayjs(article.publishAt).toISOString()
            },
            stats: {
              readCount: item.read_count,
              likeCount: item.like_count,
              commentCount: item.comment_count,
              fetchedAt: lastCalculatedAt!.toISOString()
            }
          }
        }]
      })

      for (const [index, item] of requestBody.entries()) {
        console.log(`updateStats: 【${index + 1}/${requestBody.length}】${item.params.noteArticleId}`)
        await api.POST("/me/articles/{noteArticleId}/stats", {
          params: {
            path: {
              noteArticleId: item.params.noteArticleId
            }
          },
          body: item.body
        })

        setProgress(calculateProgress(phases.post, requestBody.length, index + 1))
      }

      await api.PUT("/me/user", {
        body: {
          lastNoteCalculatedAt: lastCalculatedAt!.toISOString()
        }
      })

      return "success"
    } catch (e) {
      throw e instanceof Error ? e : new Error(String(e))
    } finally {
      setIsProcessing(false)
    }
  }

  return { 
    updateStats,
    isProcessing, 
    progress
  }
}

/** 進捗率の計算を行う。
 * 
 * phasesのステージ数で全体のうちそのステージが占める割合を考慮した計算を行う。
 */
function calculateProgress(phase: number, totalPages: number, page: number) {
  return Math.min(
    phases.start(phase) + page * (phases.range(phase) / totalPages),
    phases.end(phase)
  )
}