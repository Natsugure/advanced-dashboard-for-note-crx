import { z } from "zod"

export const ArticlesSchema = z.object({
  data: z.object({
    notes: z.array(z.object({
      id: z.int().pipe(z.coerce.number()),
      key: z.string(),
      publishAt: z.string().nullable(),
    })),
    totalCount: z.int().pipe(z.coerce.number()),
    isLastPage: z.boolean(),
  })
})

export const StatsSchema = z.object({
  data: z.object({
    last_page: z.boolean(),
    note_stats: z.array(z.object({
      id: z.int().pipe(z.coerce.number()),
      key: z.string(),
      name: z.string(),
      status: z.string(), // ここにユニオン型は使える？
      read_count: z.int().pipe(z.coerce.number()),
      like_count: z.int().pipe(z.coerce.number()),
      comment_count: z.int().pipe(z.coerce.number()),
    })),
    last_calculate_at: z.string(),
  })
})

export const CurrentUserSchema = z.object({
  data: z.object({
    id: z.int().pipe(z.coerce.number()),
    nickname: z.string(),
    urlname: z.string(),
    note_count: z.int().pipe(z.coerce.number()),
  })
})

export type Articles = z.infer<typeof ArticlesSchema>["data"]
export type Stats = z.infer<typeof StatsSchema>["data"]
export type NoteCurrentUser = z.infer<typeof CurrentUserSchema>["data"]