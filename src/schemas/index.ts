import { makeExecutableSchema } from '@graphql-tools/schema'
import { gql } from 'apollo-server-express'
import { mergeTypeDefs } from '@graphql-tools/merge'
import _ from 'lodash'
import { applyMiddleware } from 'graphql-middleware'
import { constraintDirective, constraintDirectiveTypeDefs } from 'graphql-constraint-directive'

import userTypes from '@modules/user/schema/user'
import authTypes from '@modules/auth/schema/auth'
import roleTypes from '@modules/role/schema/role'
import productTypes from '@modules/product/schema/product'
import couponsTypes from '@modules/coupons/schema/coupons'

import { authResolvers } from '@modules/auth/resolvers/index'
import { rolesResolvers } from '@modules/role/resolvers/index'
import { productResolvers } from '@modules/product/resolvers/index'
import { couponResolvers } from '@modules/coupons/resolvers/index'

import Permissions from '@middlewares/permissions'

const Query = gql`
	type Query {
		ping: Success!
	}

	type Mutation {
		ping: Success!
	}

	enum Success {
		SUCCESS
	}
`

const resolver = {
	Query: {
		ping: () => 'SUCCESS',
	},
	Mutation: {
		ping: () => {
			return 'SUCCESS'
		},
	},
}

const typeDefs = mergeTypeDefs([Query, authTypes, userTypes, roleTypes, productTypes, couponsTypes])
const resolvers = _.merge(
	resolver,
	rolesResolvers,
	authResolvers,
	productResolvers,
	couponResolvers
)

const schema = constraintDirective()(
	makeExecutableSchema({
		typeDefs: [typeDefs, constraintDirectiveTypeDefs],
		resolvers,
	})
)

export const schemaWithMiddleware = applyMiddleware(schema, Permissions)
