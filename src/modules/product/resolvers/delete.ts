import { UserInputError } from 'apollo-server-errors'
import { App } from '@core/globals'
import { Logger } from '@core/globals'

interface ProductInput {
	input: {
		id: typeof App.ObjectId
	}
}

interface ProductResponse {
	message: string
	status: string
}

export const remove = {
	Mutation: {
		deleteProduct: async (
			__: any,
			{ input }: ProductInput,
			{ dataSources: { Product }, user }
		): Promise<ProductResponse> => {
			Logger.info('Inside deleteProduct resolver')
			try {
				const { id } = input
				const updatedProduct = await Product.updateProduct(id, {
					isDeleted: true,
					updatedById: user._id,
				})

				if (!updatedProduct) return { message: 'Error deleting product', status: 'error' }

				return {
					message: 'Product Deleted successfully',
					status: 'success',
				}
			} catch (error) {
				Logger.error(`${error.message}`)
				throw new UserInputError(`${error.message}`)
			}
		},
	},
}
