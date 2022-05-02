import { App } from '@core/globals'
import { BaseModel } from '@core/database'
import { Schema, model, Model, Document } from 'mongoose'
const ObjectId = Schema.Types.ObjectId

export interface RoleDoc extends BaseModel, Document {
	name: string
	permissions: number[]
	isActive: boolean
}

export interface Permissions {
	Admin?: PermissionsBoolean
	User?: PermissionsBoolean
}

interface PermissionsBoolean {
	GET?: boolean
	GET_ALL?: boolean
	CREATE?: boolean
	UPDATE?: boolean
	DELETE?: boolean
}

interface RoleModel extends Model<RoleDoc> {
	getById(id: string, projection: any): RoleDoc | null
	getByName(name: string): RoleDoc
}

const RoleSchema = new Schema<RoleDoc>(
	{
		name: { type: String, unique: true, required: true },
		permissions: { type: [Number], required: true },

		// From Base Model
		isActive: { type: Boolean, default: true },
		createdById: { type: ObjectId, ref: 'User', select: false },
		updatedById: { type: ObjectId, ref: 'User', select: false },
	},
	{
		autoIndex: true,
		versionKey: false,
		timestamps: true,
	}
)

// Function to check if any document exits with the given id
RoleSchema.statics.getById = (id: string, projection: any = {}) => {
	return App.Models.Role.findOne({ _id: id }, projection)
}

// Function to check if any document exits with the given name
RoleSchema.statics.getByName = (name) => {
	return App.Models.Role.findOne({ name })
}

export const Role = model<RoleDoc, RoleModel>('Role', RoleSchema)
