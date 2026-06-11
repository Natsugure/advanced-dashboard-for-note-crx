import { ArticlesSchema, CurrentUserSchema, StatsSchema } from "./noteApiSchema"

export class NoteApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "NoteApiError"
    this.status = status
  }
}

const baseUrl = "https://note.com/api"

export async function fetchStats(page: number) {
  const url = `${baseUrl}/v1/stats/pv?filter=all&page=${page}`

  try {
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) {
      if (res.status === 401) {
        throw new NoteApiError(res.status, "Unauthorized: ブラウザ上でnoteにログインしてください。")
      }
      throw new NoteApiError(res.status, await res.text())
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
      if (res.status === 401) {
        throw new NoteApiError(res.status, "Unauthorized: noteにログインしてください。")
      }
      throw new NoteApiError(res.status, await res.text())
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
      if (res.status === 401) {
        throw new NoteApiError(res.status, "Unauthorized: noteにログインしてください。")
      }
      throw new NoteApiError(res.status, await res.text())
    }

    const articles = ArticlesSchema.parse(await res.json())
    return articles.data
  } catch (e) {
    console.error(e)
    throw e
  }
}