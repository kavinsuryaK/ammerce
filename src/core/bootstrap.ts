import { App } from '@core/globals'
import { Database } from '@core/database'
import JWTHelper from '@helpers/jwt'
import { Logger } from '@core/logger'

export default async () => {
	Logger.info('Inside Bootstrap')

	await connectDatabase()

	JWTHelper.GenerateKeys()
}

const connectDatabase = async () => {
	Logger.info('Inside connectDatabase')
	const database = new Database({
		url: App.Config.DB_CONNECTION_STRING,
	})
	await database.connect()
	App.Database = database
}
