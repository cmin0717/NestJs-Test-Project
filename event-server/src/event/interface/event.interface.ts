import { EventDetail } from '../schema/event-detail.schema'
import { Event } from '../schema/event.schema'

export interface EventWithDetailResponse {
  event: Event
  details: EventDetail[]
}
