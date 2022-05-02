import { UserInputError } from 'apollo-server-errors'
import { App } from '@core/globals'
import { Logger } from '@core/globals'

interface CouponInput {
	input: {
		id: typeof App.ObjectId
	}
}

interface CouponResponse {
	message: string
	status: string
}

export const remove = {
	Mutation: {
		deleteCoupon: async (
			__: any,
			{ input }: CouponInput,
			{ dataSources: { Coupon }, user }
		): Promise<CouponResponse> => {
			Logger.info('Inside deleteCoupon resolver')
			try {
				const { id } = input
				const updatedCoupon = await Coupon.updateCoupon(id, {
					isDeleted: true,
					updatedById: user._id,
				})

				if (!updatedCoupon) return { message: 'Error deleting Coupon', status: 'error' }

				return {
					message: 'Coupon Deleted successfully',
					status: 'success',
				}
			} catch (error) {
				Logger.error(`${error.message}`)
				throw new UserInputError(`${error.message}`)
			}
		},
	},
}
