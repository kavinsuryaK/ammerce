import { Logger } from '@core/globals'
import { FileExistsSync } from './utils'

export interface ConfigInterface {
	PORT: number
	ENVIRONMENT: string

	DB_CONNECTION_STRING: string

	SALT_ROUNDS: number

	JWT_SECRET: string
	JWT_EXPIRY: string

	MTV_NFT_TOKEN_ADDRESS: string
	MTV_NTF_ALCHEMY_URL: string
	MTV_IMPORT_NFT_URL: string
	MTV_NFT_MARKETPLACE_ADDRESS: string

	SUPER_ADMIN_NAME: string
	SUPER_ADMIN_EMAIL: string
	SUPER_ADMIN_MOBILE: string
	SUPER_ADMIN_COUNTRY_CODE: string
	SUPER_ADMIN_PASSWORD: string

	COLLECTION_USER_NAME: string

	TWILIO: {
		SID: string
		TOKEN: string
		FROM: string
	}

	SENDGRID_API_KEY: string
	SENDGRID_DEFAULT_SENDER_EMAIL: string
}

export default (): ConfigInterface => {
	Logger.info('Inside ConfigInterface')
	const { NODE_ENV = 'development' } = process.env
	const environment = NODE_ENV?.toLowerCase()
	const environmentFileLocation = `${__dirname}/../environments`
	const environmentFilePath = `${environmentFileLocation}/${environment}`
	if (FileExistsSync(environmentFilePath)) {
		/* eslint-disable */
		// prettier-ignore
		const configuration: ConfigInterface = (require(environmentFilePath).default)()
		/* eslint-enable */
		return configuration
	} else {
		Logger.error(`Missing environment file for NODE_ENV=${environment}.`)
		throw Error(`Missing environment file for NODE_ENV=${environment}.`)
	}
}
