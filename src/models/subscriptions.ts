import { Schema, model, Model, Document } from 'mongoose'
import { BaseModel } from '@core/database'

const { ObjectId } = Schema.Types

export interface SubcriptionAttrs {
	email: string
	isActive: boolean
}

// TS Schema
export interface SubcriptionDoc extends Document, BaseModel {
	id: typeof ObjectId
	email: string
	isActive: boolean
}

interface SubcriptionModel extends Model<SubcriptionDoc> {
	build(attrs: SubcriptionAttrs): SubcriptionDoc
}

const subcriptionSchema = new Schema<SubcriptionDoc>(
	{
		email: { type: String },
		isActive: { type: Boolean, default: true },
	},
	{
		autoIndex: true,
		versionKey: false,
		timestamps: true,
	}
)

export const Subcribe = model<SubcriptionDoc, SubcriptionModel>('Subcription', subcriptionSchema)

// Static Methods
// Function to create a new Item
subcriptionSchema.statics.build = async (attrs: SubcriptionAttrs) => {
	const subcribe = new Subcribe(attrs)
	await subcribe.save()
	return subcribe
}
