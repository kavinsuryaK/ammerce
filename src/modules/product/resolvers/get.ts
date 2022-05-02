import { UserInputError } from 'apollo-server-errors'
import { Logger } from '@core/globals'
import { ProductDoc } from '@models/product'

interface getProductPayload {
	id: string
}

interface Context {
	dataSources: any
}

export const product = {
	Query: {
		async product(
			__: any,
			{ id }: getProductPayload,
			{ dataSources: { Product } }: Context,
			info: any
		): Promise<ProductDoc> {
			Logger.info('Inside getProduct Resolvers')
			try {
				const product = await Product.getProductById(id, info)

				if (!product) {
					throw new UserInputError('Product does not exist.')
				}

				return product
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
}
