import { RewardHistory } from '../schema/reward-history.schema'

export interface RewardHistoryPagingResponse {
  items: RewardHistory[]
  hasNextPage: boolean
  cursorId: string | null
}
