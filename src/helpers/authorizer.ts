import { Logger } from '@core/globals'
import { Request } from 'express'
import JWTHelper from '@helpers/jwt'
import { AuthenticationError } from 'apollo-server-errors'

export const authorize = async (req: Request) => {
	try {
		const token = req.headers.authorization.split(' ')[1]

		const user = await JWTHelper.GetUser({ token })

		if (!user) {
			return null
		}

		return user
	} catch (error) {
		Logger.error(error)
		throw new AuthenticationError('Error in authorization')
	}
}
