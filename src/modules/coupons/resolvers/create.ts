import { UserInputError } from 'apollo-server-errors'
import { Logger } from '@core/globals'

interface CreateCouponInput {
	input: {
		name: string
		description: string
		price: string
		discount: string
	}
}

interface CreateCouponResponse {
	message: string
	status: string
}

export const create = {
	Mutation: {
		createCoupon: async (
			__: any,
			{ input }: CreateCouponInput,
			{ dataSources: { Coupon }, user }
		): Promise<CreateCouponResponse> => {
			Logger.info('Inside createCoupon resolver')
			try {
				const { name, description, price, discount } = input

				const payload = {
					name,
					description,
					price,
					discount,
					createdById: user._id,
				}

				const existingProduct = await Coupon.checkExistingCoupon({ name, isDeleted: false })
				if (existingProduct) {
					return {
						message: 'Coupon already exists',
						status: 'error',
					}
				}

				const product = await Coupon.createCoupon(payload)

				if (!product) return { status: 'error', message: 'Coupon not found' }

				return {
					message: 'Coupon Created Successfully!',
					status: 'success',
				}
			} catch (error) {
				Logger.error(`${error.message}`)
				throw new UserInputError(`${error.message}`)
			}
		},
	},
}
