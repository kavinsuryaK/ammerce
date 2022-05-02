import { UserInputError } from 'apollo-server-errors'
import { App, Logger } from '@core/globals'
import sgMail from '@helpers/send-grid'
import TwilioHelper from '@helpers/twilio'
interface SubscribePayload {
	input: {
		inputType: string
		email?: string
		mobile?: string
		countryCode?: string
	}
}

interface Context {
	dataSources: any
}

interface subscribeResponse {
	message: string
	status: string
}

export const create = {
	Mutation: {
		async subscribe(
			__: any,
			{ input }: SubscribePayload,
			{ dataSources: { Subscribe } }: Context
		): Promise<subscribeResponse> {
			Logger.info('Inside subscribe Resolvers')
			try {
				const { email, mobile, countryCode, inputType } = input

				if (inputType === 'EMAIL') {
					const existingEmail = await Subscribe.userDetails({ email })
					if (existingEmail) {
						if (existingEmail.isActive === false) {
							await Subscribe.update(existingEmail._id, {
								isActive: true,
							})
						}
					} else {
						const subscribe = await Subscribe.create({
							email,
						})
						if (!subscribe)
							return {
								message: 'Error in subscribing ',
								status: 'error',
							}
					}
				} else {
					const existingMobile = await Subscribe.userSubcriptionDetails({ mobile })
					if (existingMobile) {
						if (existingMobile.isActive === false) {
							await Subscribe.update(existingMobile._id, {
								isActive: true,
							})
						}
					} else {
						const subscribe = await Subscribe.create({
							countryCode,
							mobile,
						})
						if (!subscribe)
							return {
								message: 'Error in subscribing ',
								status: 'error',
							}
					}
				}
				if (inputType === 'EMAIL') {
					await sgMail.send({
						to: email,
						from: App.Config.SENDGRID_DEFAULT_SENDER_EMAIL,
						subject: 'Newsletter subscription',
						text: `Your Email account ${email} has been successfully subscribed`,
					})
				} else {
					const options = {
						body: `Newsletter subscription
                        Your mobile account ${countryCode} ${mobile} has been successfully subscribed
					`,
						to: `${countryCode}${mobile}`,
					}

					await TwilioHelper.Send(options)
				}

				return {
					message: 'Subscribed Successfully',
					status: 'success',
				}
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
}
