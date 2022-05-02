import { gql } from 'apollo-server-express'

const subcriptionTypes = gql`
	type Mutation {
		subscribe(input: subscribeInput!): messageResponse!
		unsubscribe(input: subscribeInput!): messageResponse!
	}
	input subscribeInput {
		inputType: Type!
		email: String
		mobile: String
		countryCode: String
	}
	enum Type {
		EMAIL
		MOBILE
	}
`

export default subcriptionTypes
