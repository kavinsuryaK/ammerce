import { App, Logger } from '@core/globals'
import { UserInputError } from 'apollo-server-errors'
import { UserDoc } from '@models/user'
import _ from 'lodash'
import AvatarHelper from '@helpers/avatars'
import sgMail from '@helpers/send-grid'

interface SignupPayload {
	input: {
		fullName: string
		email: string
		countryCode: string
		mobile: string
		password: string
		profilePic?: string
	}
}

interface Context {
	dataSources: any
}
interface SignupResponse {
	message: string
	user: UserDoc | null
	status: string
}

export const signUp = {
	Mutation: {
		signUp: async function (
			__: any,
			{ input }: SignupPayload,
			{ dataSources: { User, Role } }: Context
		): Promise<SignupResponse> {
			Logger.info('Inside signUp Resolver')
			try {
				const { fullName, email, countryCode, mobile, password } = input
				let { profilePic } = input
				if (!profilePic) {
					profilePic = AvatarHelper.getAvatar()
				}
				// Check for user exists
				let user = await User.checkExistingUser({
					email,
				})
				const mobileExists = await User.checkExistingUser({ mobile })

				if (mobileExists) {
					return {
						message: 'Error in Signup. Mobile number already exists',
						user,
						status: 'Failed',
					}
				}
				if (user.isBlocked) {
					return {
						message: 'Error in Signup. User Blacklisted',
						user,
						status: 'blacklisted',
					}
				}

				// If not exists create user
				if (!user) {
					const role = await Role.getDefaultRole({ name: 'User default permissions' })

					if (!role) return { message: 'Error in signup', user: null, status: 'error' }

					const query = _.pickBy(
						{
							fullName,
							email,
							countryCode,
							mobile,
							password,
							profilePic,
							accountType: Role.USER,
							roleId: role._id,
						},
						_.identity
					)
					user = await User.create(query)
				}
				await sgMail.send({
					to: email,
					from: App.Config.SENDGRID_DEFAULT_SENDER_EMAIL,
					subject: 'User created succesfully',
					text: `Email for your account is ${email} is been created.`,
				})
				return { message: 'Sign up', user, status: 'success' }
			} catch (error) {
				Logger.error(`${error.message}`)
				throw new UserInputError(error.message)
			}
		},
	},
}
