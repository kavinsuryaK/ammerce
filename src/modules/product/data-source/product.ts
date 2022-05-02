import { UserInputError } from 'apollo-server-errors'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Logger } from '@core/globals'
import { ProductDoc } from '@models/product'
import { create, checkFlag, update } from '@helpers/mongoose'
import DataLoader from 'dataloader'
import { Keys } from '@modules/role/data-source/role'
import ProjectionField from '@helpers/projection-field'
import Pagination from '@helpers/pagination'
import { GraphQLInput, PageResponse, PageInfo, Edge } from '@modules/user/data-source/user'
import QueryResolver from '@helpers/query-resolver'
import _ from 'lodash'
export default class ProductDataSource extends MongoDataSource<ProductDoc> {
	private Product: any
	private productPagination: any
	constructor(Product) {
		super(Product)
		this.productPagination = new Pagination(Product)
	}

	public async getProducts(
		{ after, before, first, last, orderBy, filters }: GraphQLInput,
		info: any
	): Promise<PageResponse> {
		Logger.info('Inside getProducts Datasource Service')
		try {
			const sort = QueryResolver.GetSortObj(orderBy)

			let filter = {}
			if (filters && Object.keys(filters).length > 0) filter = QueryResolver.GetFilterObj(filters)

			const queryArgs = _.pickBy({ after, before, first, last, filter, sort }, _.identity)

			const projection = await ProjectionField.ParseProjectionField(info, this.model.schema.obj)

			const edges: Edge[] = await this.productPagination.GetEdges(queryArgs, projection)

			const pageInfo: PageInfo | any = await this.productPagination.GetPageInfo(edges, queryArgs)

			return { edges, pageInfo }
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}
	private _productByIdLoader = new DataLoader(async (keys: Keys[]) => {
		Logger.info('Inside _productByIdLoader')
		try {
			const ids = [...new Set(keys.map((key) => key.id))]
			const roles = await this.model
				.find({ _id: { $in: ids } })
				.select(keys[0].projection)
				.exec()
			return keys.map((key) => {
				return roles.find((role) => role._id.toString() === key.id.toString())
			})
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	})
	public async checkExistingProduct(query: any): Promise<boolean> {
		Logger.info('Inside checkExistingProduct Datasource Service')
		try {
			return checkFlag(this.model, query)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}
	public async createProduct(payload: any): Promise<ProductDoc> {
		Logger.info('Inside createProduct Datasource Service')
		try {
			return create(this.model, payload)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async updateProduct(id: string, data: any) {
		Logger.info('Inside updateProduct Datasource Service')
		try {
			return update(this.model, { _id: id, isActive: true }, data)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}
	public async getProductById(id: string, info: any) {
		Logger.info('Inside getProductById Datasource Service')
		try {
			if (id) {
				const projection = await ProjectionField.ParseProjectionField(info, this.model.schema.obj)
				return this._productByIdLoader.load({ id, projection })
			}
			return null
		} catch (err) {
			Logger.error(`${err}`)
			throw new UserInputError(`${err.message}`)
		}
	}
}
