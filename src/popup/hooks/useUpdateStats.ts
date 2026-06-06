import { useState } from "react"
import { useApiClient } from "./useApiClient"
import { useUser } from "./useUsers"
import { fetchArticles, fetchCurrentUser, fetchStats } from "@/lib/noteApi"
import type { Articles, Stats } from "@/lib/noteApiSchema"
import type { UpdateStatsRequestBody } from "@/types"
import dayjs from "dayjs"

type NoteStatsResponse = Stats["note_stats"]
type NoteArticlesResponse = Articles["notes"]
interface UpdateStatsRequest {
  params: {
    noteArticleId: number
  },
  body: UpdateStatsRequestBody
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function useUpdateStats() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const fetchedAt = new Date()
  const api = useApiClient()
  const { fetchUser } = useUser()

  const updateStats = async () => {
    setIsProcessing(true)

    const statsResponse: NoteStatsResponse = []
    const articlesResponse: NoteArticlesResponse = []

    try {
      const currentUser = await fetchCurrentUser()

      const articleCount = currentUser.note_count
      const statsPerPage = 10
      const statsTotalPage = Math.ceil(articleCount / statsPerPage)
      /** Stats取得時の1ページあたりの進捗割合。*/
      const statsProgressPerPage = statsTotalPage > 0 ? 50 / statsTotalPage : 50

      for (let i = 1; i <= statsTotalPage; i++) {
        console.log(`fetchStats: Page ${i}`)
        const res = await fetchStats(i)

        if (i === 1) {
          const user = await fetchUser()
          if (!user) {
            throw new Error("user not found")
          }

          // 前回取得時から更新されていなかったら処理を抜ける
          if (dayjs(res.last_calculate_at) <= dayjs(user.lastNoteCalculatedAt)) {
            console.log("stats not updated")
            return
          }
        }

        statsResponse.push(...res.note_stats)
        // 割り切れない値で50を超えないようにする
        setProgress(Math.min(i * statsProgressPerPage, 50))
        if (i < statsTotalPage) await sleep(500)
      }
      
      // note_listには下書きも含まれていて、currentUserのnote_countと値が異なる。
      // そのため、note_listの応答に含まれるtotalCountの値とisLastPageのフラグを使って制御する。
      const articlePerPage = 16
      let page = 1
      let articleProgressPerPage = 0
      while (true) {
        const res = await fetchArticles(page)
        articlesResponse.push(...res.notes)

        if (page === 1) {
          const totalPages = Math.ceil(res.totalCount / articlePerPage)
          articleProgressPerPage = totalPages > 0 ? 50 / totalPages : 50
        }

        // stats終了分の50を常に足す。そして、割り切れない値で100を超えないようにする。
        setProgress(Math.min(page * articleProgressPerPage + 50, 100))

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
              fetchedAt: fetchedAt.toISOString()
            }
          }
        }]
      })

      // TODO: API送信部分も進捗率計算に含める
      for (const item of requestBody) {
        console.log(`updateStats: ${item.params.noteArticleId}, publishAt: ${item.body.article.publishedAt}`)
        await api.POST("/api/me/articles/{noteArticleId}/stats", {
          params: {
            path: {
              noteArticleId: item.params.noteArticleId
            }
          },
          body: item.body
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }
  return { updateStats, isProcessing, progress }
}