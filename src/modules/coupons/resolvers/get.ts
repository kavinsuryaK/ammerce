import { UserInputError } from 'apollo-server-errors'
import { Logger } from '@core/globals'
import { CouponDoc } from '@models/coupon'

interface getCouponPayload {
	id: string
}

interface Context {
	dataSources: any
}

export const coupon = {
	Query: {
		async coupon(
			__: any,
			{ id }: getCouponPayload,
			{ dataSources: { Coupon } }: Context,
			info: any
		): Promise<CouponDoc> {
			Logger.info('Inside getCoupon Resolvers')
			try {
				const coupon = await Coupon.getCouponById(id, info)

				if (!coupon) {
					throw new UserInputError('Coupon does not exist.')
				}

				return Coupon
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
}
