import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventDetail, EventDetailSchema } from './schema/event-detail.schema'
import { EventController } from './event.controller'
import { EventService } from './event.service'
import { Event, EventSchema } from './schema/event.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventDetail.name, schema: EventDetailSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
