import _ from 'lodash'
import { create } from './create'
import { remove } from './delete'
import { update } from './update'
import { coupon } from './get'
import { coupons } from './get-all'

export const couponResolvers = _.merge(create, remove, update, coupon, coupons)
