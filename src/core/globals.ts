import Config, { ConfigInterface } from '@config'
import { Logger } from './logger'
import { Schema } from 'mongoose'
import path from 'path'
import _ from 'lodash'
import { User } from '@models/user'
import { Role } from '@models/role'
import { Product } from '@models/product'
import { Coupon } from '@models/coupon'
import { Subcribe } from '@models/subscriptions'
import DataSources from '@datasources/index'

const { ObjectId } = Schema.Types

const config: ConfigInterface = Config()

const Models: {
	Role: typeof Role
	User: typeof User
	Product: typeof Product
	Coupon: typeof Coupon
	Subcribe: typeof Subcribe
} = { Role, User, Product, Coupon, Subcribe }

// Export Global Variables
export { Logger }
// TODO: Pass config.NODE_ENDPOINT to below instantiation.
export const App = {
	EXTENSION_ECOSYSTEM: path.extname(__filename) === '.js' ? 'js' : 'ts',
	Http: {
		app: null,
	},
	Models,
	Config: config,
	Database: null,
	datasources: DataSources,
	ObjectId,
}

// Assign them to Global
export const Global: any = global
Global.Logger = Logger
Global.App = App
Global._ = _
