import { Schema, model, Model, Document } from 'mongoose'
import { BaseModel } from '@core/database'

const { ObjectId } = Schema.Types

export interface CouponAttrs {
	id: typeof ObjectId
	name: string
	description: string
	price: number
	discount: number
	updateById: typeof ObjectId
	createdById: typeof ObjectId
}

// TS Schema
export interface CouponDoc extends Document, BaseModel {
	id: typeof ObjectId
	name: string
	description: string
	price: number
	discount: number
	updateById: typeof ObjectId
	createdById: typeof ObjectId
}

interface CouponModel extends Model<CouponDoc> {
	build(attrs: CouponAttrs): CouponDoc
}

const couponSchema = new Schema<CouponDoc>(
	{
		name: { type: String },
		description: { type: String },
		price: { type: Number },
		discount: { type: Number },
		createdById: { type: ObjectId, ref: 'User' },
		updateById: { type: ObjectId, ref: 'User' },
		isDeleted: { type: Boolean, default: false },
	},
	{
		autoIndex: true,
		versionKey: false,
		timestamps: true,
	}
)

export const Coupon = model<CouponDoc, CouponModel>('Coupon', couponSchema)

// Static Methods
// Function to create a new Item
couponSchema.statics.build = async (attrs: CouponAttrs) => {
	const coupon = new Coupon(attrs)
	await coupon.save()
	return coupon
}
