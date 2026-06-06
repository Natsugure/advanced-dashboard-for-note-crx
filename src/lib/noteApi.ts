import { ArticlesSchema, CurrentUserSchema, StatsSchema } from "./noteApiSchema"

const baseUrl = "https://note.com/api"

export async function fetchStats(page: number) {
  const url = `${baseUrl}/v1/stats/pv?filter=all&page=${page}`

  try {
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) {
      throw new Error(`status: ${res.status}`)
    }

    const note = StatsSchema.parse(await res.json())
    return note.data
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function fetchCurrentUser() {
  const url = `${baseUrl}/v2/current_user`

  try {
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) {
      throw new Error(`status: ${res.status}`)
    }

    const user = CurrentUserSchema.parse(await res.json())
    return user.data
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function fetchArticles(page: number) {
  const url = `${baseUrl}/v2/note_list/contents?page=${page}`

  try {
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) {
      throw new Error(`status: ${res.status}`)
    }

    const articles = ArticlesSchema.parse(await res.json())
    return articles.data
  } catch (e) {
    console.error(e)
    throw e
  }
}