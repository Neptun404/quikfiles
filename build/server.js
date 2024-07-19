import "dotenv/config";
import Fastify from "fastify";
import process from "process";
import path from "path";
const fastify = Fastify({
    logger: true
});
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
fastify.register(import('@fastify/static'), {
    root: path.join(__dirname, '../release/public')
});
fastify.register(import('@fastify/cors'), {
    origin: true,
});
fastify.register(import('@fastify/multipart'), {
    // attachFieldsToBody: true,
    limits: {
        files: 1,
        fileSize: 1000 * 1000 * 1.1 // 1.1mb
    }
});
fastify.register(import('./routes/routes-public.js'), { logLevel: 'warn', prefix: '/' });
fastify.register(import('./routes/routes-file.js'), { logLevel: 'info', prefix: '/file' });
try {
    const { PORT, HOST } = process.env;
    fastify.listen({ port: PORT, host: HOST });
}
catch (error) {
    fastify.log.error(error);
    process.exit(1);
}
