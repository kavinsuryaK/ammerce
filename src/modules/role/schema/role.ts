import { gql } from 'apollo-server-express'

const roleTypes = gql`
	type Query {
		"A list of roles"
		roles(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: RoleOrderByInput!
			filters: RoleWhereInput
		): RoleConnection!
		"A role details"
		role(id: String!): Role!
	}

	type Mutation {
		createRole(input: CreateRoleInput!): messageResponse!
		updateRole(where: RoleWhereUpdateInput!, input: UpdateRoleInput!): messageResponse!
		deleteRole(where: RoleWhereUpdateInput!): messageResponse!
	}
	type messageResponse {
		message: String!
		status: String!
	}

	type Role {
		id: ID!
		name: String!
		isActive: Boolean!
		permissions: Permissions!
		createdBy: User!
	}

	type Permissions {
		Dashboard: DashboardBoolean
		Admin: PermissionsBoolean
		Transaction: PermissionsBoolean
		Product: ProductsBoolean
		User: UserBoolean
		Role: RoleBoolean
		ActivityLog: ActivityLogBoolean
		Analytics: AnalyticsBoolean
		Coupen: CoupenBoolean
	}

	type PermissionsBoolean {
		GET: Boolean!
		GET_ALL: Boolean!
		UPDATE: Boolean!
		DELETE: Boolean!
	}
	type RoleBoolean {
		GET: Boolean!
		GET_ALL: Boolean!
		CREATE: Boolean!
		UPDATE: Boolean!
		DELETE: Boolean!
	}
	type DashboardBoolean {
		GET_REPORT: Boolean!
		GET_SALES: Boolean!
	}

	type ProductsBoolean {
		GET: Boolean!
		GET_ALL: Boolean!
		CREATE: Boolean!
		UPDATE: Boolean!
		BLACKLIST: Boolean!
		DELETE: Boolean!
	}

	type UserBoolean {
		BLOCK: Boolean!
		UN_BLOCK: Boolean!
		VERIFY: Boolean!
		UN_VERIFY: Boolean!
		GET: Boolean!
		GET_ALL: Boolean!
	}

	type ActivityLogBoolean {
		GET: Boolean!
		GET_ALL: Boolean!
	}

	type AnalyticsBoolean {
		GET_ONBOARDING_REPORTS: Boolean!
		EXPORT_ONBOARDING_REPORTS: Boolean!
		GET_SALES_REPORTS: Boolean!
		EXPORT_SALES_REPORTS: Boolean!
		GET_ISSUES_REPORTS: Boolean!
		EXPORT_ISSUES_REPORTS: Boolean!
	}

	type CoupenBoolean {
		CREATE_COUPENS: Boolean!
		UPDATE_COUPENS: Boolean!
		DELETE_COUPENS: Boolean!
	}

	type RoleEdge {
		cursor: ID!
		node: Role
	}

	type RoleConnection {
		edges: [RoleEdge]
		pageInfo: PageInfo!
	}

	enum RoleOrderByInput {
		createdAt_ASC
		createdAt_DESC
		name_ASC
		name_DESC
	}

	input RoleWhereInput {
		name: String
		isActiveBool: String
		createdAtFrom: String
		createdAtTo: String
		createdById: ID
	}

	input PermissionsInput {
		Dashboard: DashboardBooleanInput
		Admin: PermissionsBooleanInput
		Transaction: PermissionsBooleanInput
		Product: ProductsBooleanInput
		User: UserBooleanInput
		Role: RoleBooleanInput
		ActivityLog: ActivityLogBooleanInput
		Analytics: AnalyticsBooleanInput
		Coupen: CoupenBooleanInput
	}

	input PermissionsBooleanInput {
		GET: Boolean!
		GET_ALL: Boolean!
		CREATE: Boolean!
		UPDATE: Boolean!
		DELETE: Boolean!
	}

	input DashboardBooleanInput {
		GET_REPORT: Boolean!
		GET_SALES: Boolean!
	}
	input RoleBooleanInput {
		GET: Boolean!
		GET_ALL: Boolean!
		CREATE: Boolean!
		UPDATE: Boolean!
		DELETE: Boolean!
	}
	input ProductsBooleanInput {
		GET: Boolean!
		GET_ALL: Boolean!
		CREATE: Boolean!
		UPDATE: Boolean!
		BLACKLIST: Boolean!
		DELETE: Boolean!
	}
	input UserBooleanInput {
		BLOCK: Boolean!
		UN_BLOCK: Boolean!
		VERIFY: Boolean!
		UN_VERIFY: Boolean!
		GET: Boolean!
		GET_ALL: Boolean!
	}

	input ActivityLogBooleanInput {
		GET: Boolean!
		GET_ALL: Boolean!
	}

	input AnalyticsBooleanInput {
		GET_ONBOARDING_REPORTS: Boolean!
		EXPORT_ONBOARDING_REPORTS: Boolean!
		GET_SALES_REPORTS: Boolean!
		EXPORT_SALES_REPORTS: Boolean!
		GET_ISSUES_REPORTS: Boolean!
		EXPORT_ISSUES_REPORTS: Boolean!
	}

	input CoupenBooleanInput {
		CREATE_COUPENS: Boolean!
		UPDATE_COUPENS: Boolean!
		DELETE_COUPENS: Boolean!
	}

	input CreateRoleInput {
		name: String!
		permissions: PermissionsInput!
	}

	input RoleWhereUpdateInput {
		id: ID!
	}

	input UpdateRoleInput {
		name: String
		permissions: PermissionsInput
	}
`

export default roleTypes
