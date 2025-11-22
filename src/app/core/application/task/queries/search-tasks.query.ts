/**
 * Search Tasks Query
 * 搜尋任務查詢
 *
 * 依標題或描述內容搜尋任務
 */
export class SearchTasksQuery {
  constructor(
    public readonly workspaceId: string,
    public readonly searchTerm: string
  ) {}
}
