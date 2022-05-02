import { gql } from 'apollo-server-express'

const couponsTypes = gql`
	type Query {
		coupon(id: String!): Coupon!
		coupons(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: CouponsOrderByInput!
			filters: CouponsWhereInput
		): CouponsConnection!
	}
	type Mutation {
		createCoupon(input: creatCouponsInput!): ResponsePayload!
		deleteCoupon(input: couponsInput!): messageResponse!
		updateCoupon(where: couponsInput!, input: UpdateProductInput!): messageResponse!
	}

	type Coupon {
		id: ID!
		name: String!
		description: String!
		price: String!
		discount: String!
	}

	type CouponsEdge {
		cursor: ID
		node: Coupon
	}

	type CouponsConnection {
		edges: [CouponsEdge]
		pageInfo: PageInfo
	}
	input creatCouponsInput {
		name: String!
		description: String!
		price: String
		discount: String
	}
	input couponsInput {
		id: ID!
	}
	input UpdateCouponsInput {
		id: ID!
		name: String!
		description: String!
		price: String!
		discount: String!
	}
	enum CouponsOrderByInput {
		createdAt_ASC
		createdAt_DESC
		name_ASC
		name_DESC
	}
	input CouponsWhereInput {
		createdById: ID
		name: String
		description: String
		isDeletedBool: String
	}
`

export default couponsTypes
