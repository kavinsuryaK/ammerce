import _ from 'lodash'
import { Logger } from '@core/globals'

export const create = (model: any, data: any) => {
	Logger.info('Inside create mongoose service')
	return model.create(data)
}

export const update = (model: any, query: any, data: any) => {
	Logger.info('Inside update mongoose service')
	query = _.pickBy({ ...query }, _.identity)
	return model.findOneAndUpdate(query, data).lean()
}

export const deleteDoc = (model: any, query: any) => {
	Logger.info('Inside deleteDoc mongoose service')
	return update(model, query, { isDeleted: true, isActive: false })
}

export const detail = async (model: any, query: any, projection: any = null) => {
	Logger.info('Inside detail mongoose service')
	query = _.pickBy({ ...query }, _.identity)
	return await model.findOne(query, projection).lean()
}

export const checkFlag = async (model: any, query: any) => {
	Logger.info('Inside checkFlag mongoose service')
	const doc = await model.find(query).countDocuments()
	return doc ? true : false
}

export const detailById = (model: any, id: string, projection: any = null) => {
	Logger.info('Inside detailById mongoose service')
	return model.findById(id, projection).lean()
}

export const details = (model: any, query: any) => {
	Logger.info('Inside details mongoose service')
	return model.find(query).lean()
}
