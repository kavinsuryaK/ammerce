import { gql } from 'apollo-server-express'

const productTypes = gql`
	type Query {
		product(id: String!): Product!
		products(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: ProductOrderByInput!
			filters: ProductsWhereInput
		): ProductConnection!
	}
	type Mutation {
		createProduct(input: creatProductInput!): ResponsePayload!
		deleteProduct(input: productInput!): messageResponse!
		updateProduct(where: productInput!, input: UpdateProductInput!): messageResponse!
	}

	type Product {
		id: ID!
		name: String!
		description: String!
		price: String!
		discount: String!
		quantity: String!
		imageUrl: String!
		updateById: ID!
		companyId: ID!
		isDeleted: Boolean
		createdBy: User
	}

	type ProductEdge {
		cursor: ID
		node: Product
	}

	type ProductConnection {
		edges: [ProductEdge]
		pageInfo: PageInfo
	}
	input creatProductInput {
		name: String!
		description: String!
		price: String!
		discount: String!
		quantity: String!
		imageUrl: String!
		tags: [String!]
	}
	input productInput {
		id: ID!
	}
	input UpdateProductInput {
		name: String
		description: String
		price: String
		quantity: String
		imageUrl: String
	}
	enum ProductOrderByInput {
		createdAt_ASC
		createdAt_DESC
		name_ASC
		name_DESC
	}
	input ProductsWhereInput {
		createdById: ID
		name: String
		description: String
		isDeletedBool: String
	}
`

export default productTypes
