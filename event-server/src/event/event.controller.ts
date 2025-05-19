import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { EventService } from './event.service'
import {
  EventDetailDto,
  EventDetailUpdateDto,
  EventDto,
  EventUpdateDto,
} from './dto/event.dto'
import { RequestUser, RequestUserData } from 'src/common/user.decorator'
import { ObjectIdPipe } from 'src/common/object-id-validator'

@Controller({ path: 'event' })
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/')
  async getEvents() {
    return this.eventService.getEvents()
  }

  @Get('/:eventId')
  async getActiveEventWithDetail(
    @Param('eventId', ObjectIdPipe) eventId: string,
  ) {
    return this.eventService.getActiveEventWithDetail(eventId)
  }

  @Post('/')
  async createEvent(
    @RequestUser() user: RequestUserData,
    @Body() eventDto: EventDto,
  ) {
    return this.eventService.createEvent(user.id, eventDto)
  }

  @Post('/detail/:eventId')
  async createEventDetail(
    @RequestUser() user: RequestUserData,
    @Param('eventId', ObjectIdPipe) eventId: string,
    @Body() eventDetailDto: EventDetailDto,
  ) {
    return this.eventService.createEventDetail(user.id, eventId, eventDetailDto)
  }

  @Patch('/:eventId')
  async updateEvent(
    @Param('eventId', ObjectIdPipe) eventId: string,
    @Body() eventUpdateDto: EventUpdateDto,
  ) {
    return this.eventService.updateEvent(eventId, eventUpdateDto)
  }

  @Patch('/detail/:eventDetailId')
  async updateEventDetail(
    @Param('eventDetailId', ObjectIdPipe) eventDetailId: string,
    @Body() eventDetailUpdateDto: EventDetailUpdateDto,
  ) {
    return this.eventService.updateEventDetail(
      eventDetailId,
      eventDetailUpdateDto,
    )
  }
}
