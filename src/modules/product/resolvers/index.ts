import _ from 'lodash'
import { create } from './create'
import { remove } from './delete'
import { update } from './update'
import { product } from './get'
import { products } from './get-all'

export const productResolvers = _.merge(create, remove, update, product, products)
