import { UserInputError } from 'apollo-server-errors'
import { App } from '@core/globals'
import { Logger } from '@core/globals'

interface updateProductInput {
	where: {
		id: typeof App.ObjectId
	}
	input: {
		name?: string
		description?: string
		price?: string
		quantity?: string
		imageUrl?: string
	}
}

interface updateProductResponse {
	message: string
	status: string
}

export const update = {
	Mutation: {
		updateProduct: async (
			__: any,
			{ where, input }: updateProductInput,
			{ dataSources: { Product }, user }
		): Promise<updateProductResponse> => {
			Logger.info('Inside updateProduct resolver')
			try {
				const { id } = where
				const { name, description, price, quantity, imageUrl } = input
				const payload = { name, description, price, quantity, imageUrl, updateById: user._id }
				const product = await Product.updateProduct(id, payload)

				if (!product) return { message: 'Error updating Product', status: 'error' }

				return {
					message: 'Product updated Successfully',
					status: 'success',
				}
			} catch (error) {
				Logger.error(`${error.message}`)
				throw new UserInputError(`${error.message}`)
			}
		},
	},
}
