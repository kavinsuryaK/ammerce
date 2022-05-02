// config.ts
//? This will import the TS Rinkby Evnet file
// import './modules/wallet/index'
//? This will import the JS Rinkby Evnet file
import dotenv from 'dotenv'
dotenv.config()

// Load Path Alias For Transpiled Code [Sync]
import path from 'path'
if (path.extname(__filename) === '.js') {
	require('module-alias/register')
}

import app from '@core/app'
import Bootstrap from '@core/bootstrap'
import initApolloServer from '@core/apollo'
import { App, Logger } from '@core/globals'
;(async () => {
	const port = App.Config.PORT
	const server = await initApolloServer()

	await server.start()

	await Bootstrap()

	server.applyMiddleware({ app, cors: true })

	await new Promise<void>((resolve) => app.listen({ port }, resolve))
	Logger.info(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
})().catch((error) => {
	Logger.error('Failed to start server', error)
})
