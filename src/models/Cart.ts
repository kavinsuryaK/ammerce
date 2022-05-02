import { Schema, model, Model, Document } from 'mongoose'
import { BaseModel } from '@core/database'

const { ObjectId } = Schema.Types

export interface CartAttrs {
	description: string
	imageUrl: string
	updateById: typeof ObjectId
	createdById: typeof ObjectId
	companyId: typeof ObjectId
	productId: typeof ObjectId
	isDeleted: string
}

// TS Schema
export interface CartDoc extends Document, BaseModel {
	description: string
	imageUrl: string
	updateById: typeof ObjectId
	createdById: typeof ObjectId
	companyId: typeof ObjectId
	productId: typeof ObjectId
}

interface CartModel extends Model<CartDoc> {
	build(attrs: CartAttrs): CartDoc
}

const cartSchema = new Schema<CartDoc>(
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

export const Cart = model<CartDoc, CartModel>('Cart', cartSchema)

// Static Methods
// Function to create a new Item
cartSchema.statics.build = async (attrs: CartAttrs) => {
	const cart = new Cart(attrs)
	await cart.save()
	return cart
}
