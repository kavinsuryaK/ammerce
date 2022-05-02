import twilio from 'twilio'
import { App, Logger } from '@core/globals'
const { TWILIO } = App.Config

class TwilioHelper {
	private client: twilio.Twilio = twilio(TWILIO.SID, TWILIO.TOKEN)
	public async Send(options) {
		Logger.info('Inside Twilio Helper')
		const { body, from = TWILIO.FROM, to } = options
		const result = await this.client.messages.create({ body, from, to })
		return result
	}
}

export default new TwilioHelper()
