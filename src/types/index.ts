import type { paths } from "@/types/api"

type ArticleStatsResponse =
  paths["/me/articles/{noteArticleId}/stats"]["get"]["responses"][200]["content"]["application/json"]

export type Article = ArticleStatsResponse["article"]

export type Stat = ArticleStatsResponse["stats"][number]

export type ArticleWithStats = Article & { stats: Stat[] }

export type UpdateStatsRequestBody =  NonNullable<
    paths["/me/articles/{noteArticleId}/stats"]["post"]["requestBody"]
  >["content"]["application/json"]

export type User = 
  paths["/me/user"]["get"]["responses"][200]["content"]["application/json"]