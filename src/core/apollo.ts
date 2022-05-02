import { ApolloServer } from 'apollo-server-express'
import { RedisCache } from 'apollo-server-cache-redis'
import { App } from '@core/globals'
import { schemaWithMiddleware } from '@schemas/index'
import { authorize } from '@helpers/authorizer'

export default async function () {
	return new ApolloServer({
		schema: schemaWithMiddleware,
		persistedQueries: {
			cache: new RedisCache({
				host: '127.0.0.1',
				port: 6379,
				// ttl: 600,
			}),
		},
		introspection: process.env.NODE_ENV !== 'development',
		dataSources: App.datasources,
		context: async ({ req }) => {
			if (req.headers.authorization) {
				const user = await authorize(req)
				return { user }
			}
			return { req }
		},
	})
}
