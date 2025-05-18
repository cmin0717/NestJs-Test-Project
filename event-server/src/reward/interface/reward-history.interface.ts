import { RewardHistory } from '../schema/reward-history.schema'

export interface RewardHistoryPagingResponse {
  items: RewardHistory[]
  hasNextPage: boolean
  cursor: Date | null
}
