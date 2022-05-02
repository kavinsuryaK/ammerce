import { gql } from 'apollo-server-express'

const userTypes = gql`
	type Query {
		"Get User details"
		user(id: String!): User!
	}

	type Mutation {
		verifyUser(input: Input!): ResponsePayload!
		blockUser(input: Input!): ResponsePayload!
	}

	type User {
		id: ID!
		fullName: String
		email: String
		mobile: String
		countryCode: String
		profilePic: String
		isVerified: Boolean
	}

	type UserEdge {
		cursor: ID!
		node: User
	}

	type UserConnection {
		edges: [UserEdge]
		pageInfo: PageInfo!
	}

	type PageInfo {
		endCursor: ID
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
		startCursor: ID
	}

	type ResponsePayload {
		message: String!
		status: String!
	}

	input Input {
		id: String!
	}
	enum AccountType {
		ADMIN
		SUB_ADMIN
		SUPER_ADMIN
		USER
	}
`

export default userTypes
