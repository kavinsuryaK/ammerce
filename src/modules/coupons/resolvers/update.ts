import { UserInputError } from 'apollo-server-errors'
import { App } from '@core/globals'
import { Logger } from '@core/globals'

interface updateCouponInput {
	where: {
		id: typeof App.ObjectId
	}
	input: {
		name?: string
		description?: string
		price?: string
		discount?: string
	}
}

interface updateCouponResponse {
	message: string
	status: string
}

export const update = {
	Mutation: {
		updateCoupon: async (
			__: any,
			{ where, input }: updateCouponInput,
			{ dataSources: { Coupon }, user }
		): Promise<updateCouponResponse> => {
			Logger.info('Inside updateCoupon resolver')
			try {
				const { id } = where
				const { name, description, price, discount } = input
				const payload = { name, description, price, discount, updateById: user._id }
				const coupon = await Coupon.updateCoupon(id, payload)

				if (!coupon) return { message: 'Error updating Coupon', status: 'error' }

				return {
					message: 'Coupon updated Successfully',
					status: 'success',
				}
			} catch (error) {
				Logger.error(`${error.message}`)
				throw new UserInputError(`${error.message}`)
			}
		},
	},
}
