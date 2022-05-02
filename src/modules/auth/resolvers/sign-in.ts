import { UserInputError } from 'apollo-server-errors'
import { Logger } from '@core/globals'
import _ from 'lodash'
import { Password } from '@helpers/password'
import JWTHelper from '@helpers/jwt'

interface SignInAttrs {
	input: {
		email: string
		password: string
	}
}

interface SignInResponse {
	message: string
	token?: string
	status: string
}

export const signIn = {
	Mutation: {
		signIn: async (
			__,
			{ input }: SignInAttrs,
			{ dataSources: { Auth } }
		): Promise<SignInResponse> => {
			Logger.info('Inside signIn Mutation')
			try {
				const { email, password } = input

				// Fetch user
				const query = _.pickBy({ email, isActive: true, isDeleted: false }, _.identity)

				const user = await Auth.getUserForAuth(query)

				if (!user) {
					return {
						message: 'Invalid Credentials',
						status: 'error',
					}
				}

				if (!password || !(await Password.compare(password, user.password))) {
					return {
						message: 'Invalid Credentials',
						status: 'error',
					}
				}

				const token = JWTHelper.GenerateToken({
					_id: user._id.toString(),
					accountTypeCode: user.accountTypeCode,
				})

				return {
					message: 'Login Successful.',
					token,
					status: 'success',
				}
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(err.message)
			}
		},
	},
}
