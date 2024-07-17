import { FastifyPluginCallback } from "fastify";

const publicRoutes: FastifyPluginCallback = async (
    fast,
    opts,
    done,
) => {
    fast.get('/', async (req, repl) => {
        return repl.sendFile('index.html')
    })

    fast.get('/download/', async (req, repl) => {
        return repl.sendFile('download.html')
    })
}

export default publicRoutes