import { Schema, model, Model, Document } from 'mongoose'
import { BaseModel } from '@core/database'

const { ObjectId } = Schema.Types

export interface RatingsAttrs {
	description: string
	imageUrl: string
	updateById: typeof ObjectId
	createdById: typeof ObjectId
	companyId: typeof ObjectId
	productId: typeof ObjectId
	isDeleted: string
}

// TS Schema
export interface RatingsDoc extends Document, BaseModel {
	description: string
	imageUrl: string[]
	updateById: typeof ObjectId
	createdById: typeof ObjectId
	companyId: typeof ObjectId
	productId: typeof ObjectId
}

interface RatingsModel extends Model<RatingsDoc> {
	build(attrs: RatingsAttrs): RatingsDoc
}

const ratingsSchema = new Schema<RatingsDoc>(
	{
		productId: { type: Number },
		companyId: { type: Number },
		description: { type: String },
		imageUrl: [{ type: String, _id: false }],
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

export const Ratings = model<RatingsDoc, RatingsModel>('Ratings', ratingsSchema)

// Static Methods
// Function to create a new Item
ratingsSchema.statics.build = async (attrs: RatingsAttrs) => {
	const ratings = new Ratings(attrs)
	await ratings.save()
	return ratings
}
