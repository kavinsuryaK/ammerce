import { Logger } from '@core/logger'
import { UserInputError } from 'apollo-server-errors'

export const products = {
	Query: {
		async products(__: any, args: any, { dataSources: { Product } }, info: any) {
			Logger.info('Inside products Resolver')
			try {
				args.filters = { ...args.filters }
				const products = await Product.getProducts(args, info)

				if (!products) throw new Error('No products found')

				return { edges: products.edges, pageInfo: products.pageInfo }
			} catch (err) {
				Logger.error(`${err}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
}
