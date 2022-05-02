import mongoose from 'mongoose'

const { ObjectId } = mongoose.Types

class QueryResolver {
	private _getBoolean(value: string) {
		if (value === 'true') {
			return true
		}
		if (value === 'false') {
			return false
		}
	}

	public GetFilterObj(filter: any) {
		const filters = []
		if (filter) {
			const filterKeys = Object.keys(filter)
			if (filterKeys.length > 0) {
				filterKeys.map((key) => {
					const value = filter[key]
					if (key.includes('From')) {
						key = key.replace('From', '')
						filters.push({ [key]: { $gte: new Date(value) } })
					} else if (key.includes('To')) {
						key = key.replace('To', '')
						filters.push({ [key]: { $lte: new Date(value) } })
					} else if (key.includes('Id') || key.includes('_id')) {
						filters.push({ [key]: new ObjectId(value) })
					} else if (key.includes('Bool')) {
						key = key.replace('Bool', '')
						filters.push({ [key]: this._getBoolean(value) })
					} else if (key.includes('Match')) {
						key = key.replace('Match', '')
						filters.push({ [key]: value })
					} else {
						filters.push({ [key]: { $regex: value, $options: 'i' } })
					}
				})
			}
		}
		return { $and: filters }
	}

	public GetSortObj(sortEnum: string) {
		const sort = {}

		if (sortEnum) {
			const sortArgs = sortEnum.split('_')
			const [field, direction] = sortArgs
			sort[field] = direction === 'DESC' ? -1 : 1
		} else {
			sort['createdAt'] = -1
		}

		return sort
	}
}

export default new QueryResolver()
