import { Schema, model, Model, Document } from 'mongoose'
import { BaseModel } from '@core/database'

const { ObjectId } = Schema.Types

export interface ProductAttrs {
	id: typeof ObjectId
	name: string
	description: string
	price: number
	discount: number
	quantity: number
	imageUrl: string
	updateById: typeof ObjectId
	createdById: typeof ObjectId
	companyId: typeof ObjectId
}

// TS Schema
export interface ProductDoc extends Document, BaseModel {
	id: typeof ObjectId
	name: string
	description: string
	mrp: number
	discount: number
	quantity: number
	imageUrl: string
	tags: string[]
	updateById: typeof ObjectId
	createdById: typeof ObjectId
	companyId: typeof ObjectId
}

interface ProductModel extends Model<ProductDoc> {
	build(attrs: ProductAttrs): ProductDoc
}

const productSchema = new Schema<ProductDoc>(
	{
		name: { type: String },
		description: { type: String },
		mrp: { type: Number },
		discount: { type: Number },
		quantity: { type: Number },
		imageUrl: { type: String },
		tags: [{ type: String }],
		companyId: { type: ObjectId, ref: 'Company' },
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

export const Product = model<ProductDoc, ProductModel>('Product', productSchema)

// Static Methods
// Function to create a new Item
productSchema.statics.build = async (attrs: ProductAttrs) => {
	const product = new Product(attrs)
	await product.save()
	return product
}
