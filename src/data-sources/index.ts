import { App } from '@core/globals'

import UserDataSource from '@modules/user/data-source/user'
import RoleDataSource from '@modules/role/data-source/role'
import AuthDataSource from '@modules/auth/data-source/auth'
import ProductDataSource from '@modules/product/data-source/product'
import CouponDataSource from '@modules/coupons/data-source/coupons'
import SubcriptionDataSource from '@modules/subcription/data-source/subcription'

export interface Datasources {
	User: UserDataSource
	Role: RoleDataSource
	Auth: AuthDataSource
	Product: ProductDataSource
	Coupon: CouponDataSource
	Subcribe: SubcriptionDataSource
}

export default () => {
	return {
		User: new UserDataSource(App.Models.User),
		Role: new RoleDataSource(App.Models.Role),
		Auth: new AuthDataSource(App.Models.User),
		Product: new ProductDataSource(App.Models.Product),
		Coupon: new CouponDataSource(App.Models.Coupon),
		Subcribe: new SubcriptionDataSource(App.Models.Subcribe),
	}
}
