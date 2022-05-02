import { UserInputError } from 'apollo-server-errors'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Logger } from '@core/globals'
import { UserSchemaDoc, UserDoc } from '@models/user'
import { checkFlag } from '@helpers/mongoose'

export default class AuthDataSource extends MongoDataSource<UserSchemaDoc> {
	constructor(User) {
		super(User)
	}

	public async getUserForAuth(query): Promise<UserDoc> {
		Logger.info('Inside getUser Datasource Service')
		try {
			return this.model.findOne(query, '+password +verification')
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async checkExistingUser(query) {
		Logger.info('Inside checkExistingUser Datasource Service')
		try {
			return checkFlag(this.model, query)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}
}
