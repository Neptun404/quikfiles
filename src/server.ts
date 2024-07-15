import "dotenv/config"
import Fastify from "fastify"
import process from "process"

const fastify = Fastify({
    logger: true
})


fastify.register(import('./routes/routes-public.js'), { logLevel: 'warn', prefix: '/' })
fastify.register(import('./routes/routes-file.js'), { logLevel: 'info', prefix: '/file' })

try {
    const { PORT, HOST } = process.env
    fastify.listen({ port: PORT as unknown as number, host: HOST })
} catch (error) {
    fastify.log.error(error)
    process.exit(1)
}
