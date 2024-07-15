import { FastifyPluginAsync } from "fastify";





const fileRoutes: FastifyPluginAsync = async (fast, opts) => {
    fast.post('/upload', async (req, repl) => {
        return "File upload"
    })

    fast.get('/download/:id', async (req, repl) => {
        const { id } = req.params as { id: string }

        return `Downloading file with id ${id}`
    })
}

export default fileRoutes