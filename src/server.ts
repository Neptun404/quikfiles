import "dotenv/config"
import Fastify from "fastify"
import process from "process"

const fastify = Fastify({
    logger: true
})

fastify.register(import('@fastify/cors'), { origin: false })
fastify.register(import('@fastify/multipart'), {
    // attachFieldsToBody: true,
    limits: {
        files: 1,
        fileSize: 1000 * 1000 * 1000 // 1mb
    }
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
