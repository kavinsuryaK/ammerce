import { UserInputError } from 'apollo-server-errors'
import { App, Logger } from '@core/globals'
import sgMail from '@helpers/send-grid'
import TwilioHelper from '@helpers/twilio'
interface UnsubscribePayload {
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

interface UnsubscribeResponse {
	message: string
	status: string
}

export const unsubscribe = {
	Mutation: {
		async unsubscribe(
			__: any,
			{ input }: UnsubscribePayload,
			{ dataSources: { Subscribe } }: Context
		): Promise<UnsubscribeResponse> {
			Logger.info('Inside unsubscribe Resolvers')
			try {
				const { email, mobile, countryCode, inputType } = input

				if (inputType === 'EMAIL') {
					const existingEmail = await Subscribe.userDetails({ email, isActive: true })

					if (!existingEmail) {
						return {
							message: 'Email is not Subscribed',
							status: 'error',
						}
					}

					const unSubscribe = await Subscribe.update(existingEmail._id, {
						isActive: false,
					})

					if (!unSubscribe) {
						return {
							message: 'Error in unsubscribing ',
							status: 'error',
						}
					}

					await sgMail.send({
						to: email,
						from: App.Config.SENDGRID_DEFAULT_SENDER_EMAIL,
						subject: ' subscription',
						text: `Your Email account ${email} has been un-subscribed`,
					})
				} else {
					const existingMobile = await Subscribe.userSubcriptionDetails({ mobile, isActive: true })

					if (!existingMobile) {
						return {
							message: 'Mobile is not Subscribed',
							status: 'error',
						}
					}

					const unSubscribe = await Subscribe.update(existingMobile._id, {
						isActive: false,
					})

					if (!unSubscribe) {
						return {
							message: 'Error in unsubscribing ',
							status: 'error',
						}
					}
					const options = {
						body: `Newsletter subscription
                        Your Mobile number ${countryCode} ${mobile} has been successfully subscribed
					`,
						to: `${countryCode}${mobile}`,
					}

					await TwilioHelper.Send(options)
				}

				return {
					message: 'Unsubscribed  Successfully',
					status: 'success',
				}
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
}
