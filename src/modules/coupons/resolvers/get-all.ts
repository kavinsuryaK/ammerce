import { Logger } from '@core/logger'
import { UserInputError } from 'apollo-server-errors'

export const coupons = {
	Query: {
		async coupons(__: any, args: any, { dataSources: { Coupon } }, info: any) {
			Logger.info('Inside coupons Resolver')
			try {
				args.filters = { ...args.filters }
				const coupons = await Coupon.getCoupons(args, info)

				if (!coupons) throw new Error('No coupons found')

				return { edges: coupons.edges, pageInfo: coupons.pageInfo }
			} catch (err) {
				Logger.error(`${err}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
}
