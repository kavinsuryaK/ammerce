import { Schema, model, Model, Document } from 'mongoose'
import { BaseModel } from '@core/database'

const { ObjectId } = Schema.Types

export interface CompanyAttrs {
	name: string
	isDeleted: string
	description: string
	price: number
	quantity: number
	imageUrl: string
}

// TS Schema
export interface CompanyDoc extends Document, BaseModel {
	id: typeof ObjectId
	name: string
	description: string
	address: string
	masterAdminId: typeof ObjectId
	logoUrl: string
	updateById: typeof ObjectId
	createdById: typeof ObjectId
	companyId: typeof ObjectId
}

interface CompanyModel extends Model<CompanyDoc> {
	build(attrs: CompanyAttrs): CompanyDoc
}

const companySchema = new Schema<CompanyDoc>(
	{
		name: { type: String },
		description: { type: String },
		address: { type: String },
		masterAdminId: { type: ObjectId, ref: 'User' },
		logoUrl: { type: String },
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

export const Company = model<CompanyDoc, CompanyModel>('Company', companySchema)

// Static Methods
// Function to create a new Item
companySchema.statics.build = async (attrs: CompanyAttrs) => {
	const company = new Company(attrs)
	await company.save()
	return company
}
