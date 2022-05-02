import { UserInputError } from 'apollo-server-errors'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Logger } from '@core/globals'
import { CouponDoc } from '@models/coupon'
import { create, checkFlag, update } from '@helpers/mongoose'
import DataLoader from 'dataloader'
import { Keys } from '@modules/role/data-source/role'
import ProjectionField from '@helpers/projection-field'
import Pagination from '@helpers/pagination'
import { GraphQLInput, PageResponse, PageInfo, Edge } from '@modules/user/data-source/user'
import QueryResolver from '@helpers/query-resolver'
import _ from 'lodash'

export default class CouponDataSource extends MongoDataSource<CouponDoc> {
	private Coupon: any
	private couponPagination: any
	constructor(Coupon) {
		super(Coupon)
		this.couponPagination = new Pagination(Coupon)
	}

	public async getCoupons(
		{ after, before, first, last, orderBy, filters }: GraphQLInput,
		info: any
	): Promise<PageResponse> {
		Logger.info('Inside getCoupons Datasource Service')
		try {
			const sort = QueryResolver.GetSortObj(orderBy)

			let filter = {}
			if (filters && Object.keys(filters).length > 0) filter = QueryResolver.GetFilterObj(filters)

			const queryArgs = _.pickBy({ after, before, first, last, filter, sort }, _.identity)

			const projection = await ProjectionField.ParseProjectionField(info, this.model.schema.obj)

			const edges: Edge[] = await this.couponPagination.GetEdges(queryArgs, projection)

			const pageInfo: PageInfo | any = await this.couponPagination.GetPageInfo(edges, queryArgs)

			return { edges, pageInfo }
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}
	private _couponByIdLoader = new DataLoader(async (keys: Keys[]) => {
		Logger.info('Inside _couponByIdLoader')
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
	public async checkExistingCoupon(query: any): Promise<boolean> {
		Logger.info('Inside checkExistingCoupon Datasource Service')
		try {
			return checkFlag(this.model, query)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}
	public async createCoupon(payload: any): Promise<CouponDoc> {
		Logger.info('Inside createCoupon Datasource Service')
		try {
			return create(this.model, payload)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}

	public async updateCoupon(id: string, data: any) {
		Logger.info('Inside updateCoupon Datasource Service')
		try {
			return update(this.model, { _id: id, isActive: true }, data)
		} catch (err) {
			Logger.error(`${err.message}`)
			throw new UserInputError(`${err.message}`)
		}
	}
	public async getCouponById(id: string, info: any) {
		Logger.info('Inside getCouponById Datasource Service')
		try {
			if (id) {
				const projection = await ProjectionField.ParseProjectionField(info, this.model.schema.obj)
				return this._couponByIdLoader.load({ id, projection })
			}
			return null
		} catch (err) {
			Logger.error(`${err}`)
			throw new UserInputError(`${err.message}`)
		}
	}
}
