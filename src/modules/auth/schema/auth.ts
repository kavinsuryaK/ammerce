import { gql } from 'apollo-server-express'

const authTypes = gql`
	type Mutation {
		"Sign Up for users"
		signUp(input: SignUpInput!): SignUpPayload!
		"Sign In for users"
		signIn(input: SignInInput!): SignInPayload!
	}

	input SignUpInput {
		fullName: String!
		email: String!
		countryCode: String!
		mobile: String!
		password: String!
		profilePic: String
	}

	type SignUpPayload {
		"Response message in string"
		message: String!
		"Status of the response in boolean for success or failure"
		status: String!
	}

	input SignInInput {
		email: String!
		password: String!
	}

	type SignInMutPayload {
		"Response message in string"
		message: String!
		"Bearer Token for next time Authentication"
		token: String
		"Status of the response in boolean for success or failure"
		status: String!
	}

	enum GrantType {
		"Type for Password"
		PASSWORD
		"Type for TwoFactorAuthentication"
		twoFA
		"Type for Google Authenticator QR generated"
		qrGenerated
	}

	enum ResetPasswordReqType {
		"Type for Request"
		REQUEST
		"Type for TwoFactorAuthentication"
		twoFA
	}

	type SignInPayload {
		message: String!
		token: String
	}

	enum updateMobileReqType {
		UPDATE
		twoFA
	}

	enum updatePasswordReqType {
		UPDATE
		twoFA
	}
`

export default authTypes
