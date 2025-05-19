import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Event } from './schema/event.schema'
import { EventDetail } from './schema/event-detail.schema'
import {
  EventDetailDto,
  EventDetailUpdateDto,
  EventDto,
  EventUpdateDto,
} from './dto/event.dto'
import { EventWithDetailResponse } from './interface/event.interface'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<Event>,
    @InjectModel(EventDetail.name)
    private eventDetailModel: Model<EventDetail>,
  ) {}

  async getEvent(eventId: string): Promise<Event> {
    const event = await this.eventModel.findById(eventId).exec()

    if (!event) {
      throw new NotFoundException('Event not found')
    }

    return event
  }

  async getActiveEvent(eventId: string): Promise<Event> {
    const event = await this.getEvent(eventId)

    const currentDate = new Date()
    if (
      !event.active ||
      event.startDate > currentDate ||
      event.endDate < currentDate
    ) {
      throw new BadRequestException('Event is not active')
    }

    return event
  }

  async getEventDetail(eventDetailId: string): Promise<EventDetail> {
    const eventDetail = await this.eventDetailModel
      .findById(eventDetailId)
      .exec()

    if (!eventDetail) {
      throw new NotFoundException('Event detail not found')
    }

    return eventDetail
  }

  async getEvents(): Promise<Event[]> {
    const events = await this.eventModel.find().sort({ createdAt: -1 }).exec()

    return events
  }

  async getActiveEventWithDetail(
    eventId: string,
  ): Promise<EventWithDetailResponse> {
    const event = await this.getActiveEvent(eventId)

    const eventDetails = await this.eventDetailModel
      .find({ eventId: event.id })
      .exec()

    return {
      event,
      details: eventDetails,
    }
  }

  async createEvent(makerUserId: string, eventDto: EventDto): Promise<Event> {
    const { startDate, endDate } = eventDto
    const currentDate = new Date()

    if (startDate <= currentDate) {
      throw new BadRequestException('Start date must be in the future')
    }

    if (endDate <= currentDate) {
      throw new BadRequestException('End date must be in the future')
    }

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date')
    }

    const event = new this.eventModel({
      ...eventDto,
      makerUserId,
    })
    return await event.save()
  }

  async createEventDetail(
    makerUserId: string,
    eventId: string,
    eventDetailDto: EventDetailDto,
  ): Promise<EventDetail> {
    const event = await this.getEvent(eventId)

    const eventDetail = new this.eventDetailModel({
      ...eventDetailDto,
      eventId: event.id,
      makerUserId,
    })

    return await eventDetail.save()
  }

  async updateEvent(
    eventId: string,
    eventUpdateDto: EventUpdateDto,
  ): Promise<Event> {
    const event = await this.getEvent(eventId)

    const updatedEvent = await this.eventModel.findByIdAndUpdate(
      event.id,
      { $set: { ...eventUpdateDto } },
      { new: true },
    )

    return updatedEvent
  }

  async updateEventDetail(
    eventDetailId: string,
    eventDetailUpdateDto: EventDetailUpdateDto,
  ): Promise<EventDetail> {
    const eventDetail = await this.eventDetailModel
      .findById(eventDetailId)
      .exec()

    if (!eventDetail) {
      throw new NotFoundException('Event detail not found')
    }

    const event = await this.getEvent(eventDetail.eventId.toString())
    if (event.active) {
      throw new BadRequestException(
        'Active event update is not allowed, turn off active first',
      )
    }

    const updatedEventDetail = await this.eventDetailModel.findByIdAndUpdate(
      eventDetail.id,
      { $set: { ...eventDetailUpdateDto } },
      { new: true },
    )

    return updatedEventDetail
  }

  async increaseAvailableRewardCount(
    eventDetailId: string,
    number: number,
  ): Promise<void> {
    const query = { _id: eventDetailId }
    if (number < 0) query['availableRewardCount'] = { $gte: Math.abs(number) }

    const updatedEventDetail = await this.eventDetailModel.findOneAndUpdate(
      query,
      {
        $inc: { availableRewardCount: number },
      },
      { new: true },
    )

    if (!updatedEventDetail) {
      throw new BadRequestException(
        'Event available reward count is not enough',
      )
    }
  }
}
