import { and, or, rule, shield } from 'graphql-shield'
import { Logger } from '@core/globals'
import { Role } from '@core/constants/roles'

interface JwtReturnedUser {
	_id: string
	permissions: number[]
	accountTypeCode: Role
}

const checkPermission = (user: JwtReturnedUser, permission: number): boolean => {
	if (user) {
		return user.permissions.includes(permission)
	}
	return false
}

// const isAuthenticated = rule()((__: any, ___: any, { user }) => {
// 	Logger.info('Inside isAuthenticated Middleware')
// 	return user ? true : false
// })

const canReadOwnUser = rule()((__: any, ___: any, { user }) => {
	Logger.info('Inside canReadOwnUser Middleware')
	return checkPermission(user, 1002)
})

const isReadingOwnUser = rule()((__: any, { id }, { user }) => {
	Logger.info('Inside isReadingOwnUser Middleware')
	return user && user.sub === id
})

export default shield({
	Query: {
		ping: or(and(canReadOwnUser, isReadingOwnUser)),
	},
	Mutation: {},
})
