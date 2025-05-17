import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Promotion } from './promotion.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PromotionDetail } from './promotion-detail.schema'
import {
  PromotionDetailDto,
  PromotionDto,
  PromotionUpdateDto,
  PromotionDetailUpdateDto,
} from './promotion.dto'

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name)
    private promotionModel: Model<Promotion>,
    @InjectModel(PromotionDetail.name)
    private promotionDetailModel: Model<PromotionDetail>,
  ) {}

  private async getPromotion(promotionId: string) {
    const promotion = await this.promotionModel.findById(promotionId).exec()

    if (!promotion) {
      throw new NotFoundException('Promotion not found')
    }

    return promotion.toJSON()
  }

  async getPromotions() {
    const currentDate = new Date()

    const promotions = await this.promotionModel
      .find({
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
        active: true,
      })
      .exec()

    return promotions.map((promotion) => promotion.toJSON())
  }

  async getPromotionWithDetail(promotionId: string) {
    const promotion = await this.getPromotion(promotionId)
    const currentDate = new Date()

    if (
      !promotion.active ||
      promotion.startDate > currentDate ||
      promotion.endDate < currentDate
    ) {
      throw new BadRequestException('Promotion is not active')
    }

    const promotionDetails = await this.promotionDetailModel
      .find({
        promotionId: promotion._id,
      })
      .exec()

    return {
      promotion,
      details: promotionDetails.map((detail) => detail.toJSON()),
    }
  }

  async createPromotion(promotionDto: PromotionDto) {
    const currentDate = new Date()
    const { startDate, endDate } = promotionDto

    if (startDate <= currentDate) {
      throw new BadRequestException('Start date must be in the future')
    }

    if (endDate <= currentDate) {
      throw new BadRequestException('End date must be in the future')
    }

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date')
    }

    const promotionForm = new this.promotionModel(promotionDto)
    await promotionForm.save()

    return promotionForm.toJSON()
  }

  async createPromotionDetail(
    promotionId: string,
    promotionDetailDto: PromotionDetailDto,
  ) {
    const promotion = await this.getPromotion(promotionId)

    const promotionDetailForm = new this.promotionDetailModel({
      ...promotionDetailDto,
      promotionId: promotion.id,
    })
    await promotionDetailForm.save()

    return promotionDetailForm.toJSON()
  }

  async updatePromotion(
    promotionId: string,
    promotionUpdateDto: PromotionUpdateDto,
  ) {
    const promotion = await this.getPromotion(promotionId)

    const updatedPromotion = await this.promotionModel.findByIdAndUpdate(
      { id: promotion.id },
      {
        $set: {
          ...promotionUpdateDto,
        },
      },
      { new: true },
    )

    return updatedPromotion.toJSON()
  }

  async updatePromotionDetail(
    promotionDetailId: string,
    promotionDetailUpdateDto: PromotionDetailUpdateDto,
  ) {
    const promotionDetail = await this.promotionDetailModel
      .findById(promotionDetailId)
      .exec()

    if (!promotionDetail) {
      throw new NotFoundException('Promotion detail not found')
    }

    const promotion = await this.getPromotion(
      promotionDetail.promotionId.toString(),
    )

    if (promotion.active) {
      throw new BadRequestException('Promotion is active, cannot update')
    }

    const updatedPromotionDetail =
      await this.promotionDetailModel.findByIdAndUpdate(
        { id: promotionDetail.id },
        { $set: { ...promotionDetailUpdateDto } },
        { new: true },
      )

    return updatedPromotionDetail.toJSON()
  }
}
