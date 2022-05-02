import { UserInputError } from 'apollo-server-errors'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Logger } from '@core/globals'
import { SubcriptionDoc } from '@models/subscriptions'
import { create, update, checkFlag, detail } from '@helpers/mongoose'

export default class SubcriptionDataSource extends MongoDataSource<SubcriptionDoc> {
	constructor(Subcription) {
		super(Subcription)
	}

	public async createSubcription(payload: any): Promise<SubcriptionDoc> {
		Logger.info('Inside createSubcription Datasource Service')
		try {
			return create(this.model, payload)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async updateSubcription(id: string, data: any) {
		Logger.info('Inside updateSubcription Datasource Service')
		try {
			return update(this.model, { _id: id, isDeleted: false }, data)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async checkExistingSubcription(query: any): Promise<boolean> {
		Logger.info('Inside checkExistingSubcription Datasource Service')
		try {
			return checkFlag(this.model, query)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async userSubcriptionDetails(query: any) {
		Logger.info('Inside userSubcriptionDetails Datasource Service')
		try {
			return detail(this.model, query)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}
}
