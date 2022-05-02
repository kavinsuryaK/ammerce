import _ from 'lodash'
import { signUp } from './sign-up'
import { signIn } from './sign-in'

export const authResolvers = _.merge(signUp, signIn)
