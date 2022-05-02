import { UserInputError } from 'apollo-server-errors'
import { Logger } from '@core/globals'
import TwilioHelper from '@helpers/twilio'
interface CreateProductInput {
	input: {
		name: string
		description: string
		price: string
		quantity: string
		imageUrl: string
		tags: string[]
	}
}

interface CreateProductResponse {
	message: string
	status: string
}

export const create = {
	Mutation: {
		createProduct: async (
			__: any,
			{ input }: CreateProductInput,
			{ dataSources: { Product }, user }
		): Promise<CreateProductResponse> => {
			Logger.info('Inside createProduct resolver')
			try {
				const { name, description, price, quantity, imageUrl, tags } = input

				const payload = {
					name,
					description,
					price,
					quantity,
					imageUrl,
					createdById: user._id,
					tags,
				}

				const existingProduct = await Product.checkExistingProduct({ name, isDeleted: false })
				if (existingProduct) {
					return {
						message: 'Product already exists',
						status: 'error',
					}
				}

				const product = await Product.createProduct(payload)
				// const options = {
				// 	body: `The product has been successfully added
				// 	name = ${name}
				// 	description = ${description}
				// 	price = ${price}
				// 	quantity = ${quantity}
				// 	imageUrl = ${imageUrl}

				// 	It will take 2-3 days business days for verifying your product.Thanks for adding the product in ammerce
				// 	`,
				// 	to: `${user.countryCode}${user.mobile}`,
				// }

				// // Send message with verification code.
				// await TwilioHelper.Send(options)
				if (!product) return { status: 'error', message: 'Product not found' }

				return {
					message: 'Product Created Successfully!',
					status: 'success',
				}
			} catch (error) {
				Logger.error(`${error.message}`)
				throw new UserInputError(`${error.message}`)
			}
		},
	},
}
