import { FastifyPluginCallback } from "fastify";

const publicRoutes: FastifyPluginCallback = async (
    fast,
    opts,
    done,
) => {
    fast.get('/', async (req, repl) => {
        return "Hello World"
    })

}

export default publicRoutes