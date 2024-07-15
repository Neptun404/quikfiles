import { FastifyPluginCallback } from "fastify";

const publicRoutes: FastifyPluginCallback = async (
    fast,
    opts,
    done,
) => {
    fast.get('/', async (req, repl) => {
        return "Hello World"
    })

    fast.get('/download/', async (req, repl) => {
        return "Download world"
    })
}

export default publicRoutes