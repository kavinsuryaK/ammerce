import _ from 'lodash'
import DataLoader from 'dataloader'
import { UserInputError } from 'apollo-server-errors'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Logger } from '@core/globals'
import ProjectionField from '@helpers/projection-field'
import { checkFlag, detail, create, update } from '@helpers/mongoose'
import Pagination from '@helpers/pagination'
import QueryResolver from '@helpers/query-resolver'
import { UserSchemaDoc, UserDoc } from '@models/user'

export interface GraphQLInput {
	first?: number
	last?: number
	after?: string
	before?: string
	orderBy: string
	filters?: any
}
export interface PageResponse {
	edges?: Edge[]
	pageInfo?: PageInfo
}

export interface PageInfo {
	startCursor: string | null
	endCursor: string | null
	hasNextPage: boolean
	hasPreviousPage: boolean
}

export interface Edge {
	cursor: string | null
	node: any
}
export interface Keys {
	id: string
	projection: string
}

export default class UserDataSource extends MongoDataSource<UserSchemaDoc> {
	private userPagination: any
	constructor(User) {
		super(User)
		this.userPagination = new Pagination(User)
	}

	private _userByIdLoader = new DataLoader(async (keys: Keys[]) => {
		Logger.info('Inside _userByIdLoader')
		try {
			const ids = [...new Set(keys.map((key) => key.id))]
			const users = await this.model
				.find({ _id: { $in: ids } })
				.select(keys[0].projection)
				.exec()

			return keys.map((key) => {
				return users.find((user) => user._id.toString() === key.id.toString())
			})
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	})

	public async getUserById(id: string, info: any) {
		Logger.info('Inside getUserById Datasource Service')
		try {
			if (id) {
				const projection = await ProjectionField.ParseProjectionField(info, this.model.schema.obj)

				return this._userByIdLoader.load({ id, projection })
			}
			return null
		} catch (err) {
			Logger.error(`${err}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async getUser(query: any, info: any) {
		Logger.info('Inside getUser Datasource Service')
		try {
			const projection = await ProjectionField.ParseProjectionField(info, this.model.schema.obj)

			return detail(this.model, query, projection)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async updateUser(id: string, data: any) {
		Logger.info('Inside updateUser Datasource Service')
		try {
			return update(this.model, { _id: id, isDeleted: false }, data)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async checkExistingUser(query: any) {
		Logger.info('Inside checkExistingUser Datasource Service')
		try {
			return checkFlag(this.model, query)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async checkExistingUsers(ids: string[]) {
		Logger.info('Inside checkExistingUsers Datasource Service')
		try {
			const docs = await this.model.find({ _id: { $in: ids } }).countDocuments()

			return docs === ids.length
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}
	public async create(payload: any): Promise<UserDoc> {
		Logger.info('Inside create Datasource Service')
		try {
			return create(this.model, payload)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}
	public async getUsersDetailsByIds(
		ids: string[],
		info: any
	): Promise<(UserSchemaDoc & { _id: typeof import('mongoose').Schema.Types.ObjectId })[]> {
		Logger.info('Inside getUsersDetailsByIds Datasource Service')
		try {
			if (ids.length <= 0) return []
			const projection = await ProjectionField.ParseProjectionField(info, this.model.schema.obj)
			return this.model
				.find({ _id: { $in: ids } })
				.select(projection)
				.exec()
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async getUsers(
		{ after, before, first, last, orderBy, filters }: GraphQLInput,
		info: any
	): Promise<PageResponse> {
		Logger.info('Inside getUsers Datasource Service')
		try {
			const sort = QueryResolver.GetSortObj(orderBy)

			let filter = {}
			if (filters && Object.keys(filters).length > 0) filter = QueryResolver.GetFilterObj(filters)

			const queryArgs = _.pickBy({ after, before, first, last, filter, sort }, _.identity)

			const projection = await ProjectionField.ParseProjectionField(info, this.model.schema.obj)

			const edges: Edge[] = await this.userPagination.GetEdges(queryArgs, projection)

			const pageInfo: PageInfo | any = await this.userPagination.GetPageInfo(edges, queryArgs)

			return { edges, pageInfo }
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}
}
