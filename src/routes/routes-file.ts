import { MultipartFields, MultipartFile, MultipartValue } from "@fastify/multipart";
import { FastifyPluginAsync } from "fastify";
// import fs from 'fs/promises';


import fs from 'fs';
import util from 'util';
import path from 'path';
import { pipeline } from 'stream';
const pump = util.promisify(pipeline)
import { PrismaClient } from "@prisma/client";

const fileRoutes: FastifyPluginAsync = async (fast, opts) => {
    fast.post('/upload', async (req, repl) => {
        // Gets user uploaded file
        const data = await req.file()
        if (data === undefined) return;

        // Buffer file to memory
        const buffer = await bufferFile(data)
        if (buffer.truncated || buffer.buffer === null) {
            repl.statusCode = 413
            return `${data.filename} is too large`
        }

        // TODO Save file into s3


        // Save file link into database
        const prisma = new PrismaClient()
        const fileLink = await prisma.fileLink.create({
            data: {
                link: data.filename
            }
        }).catch(e => console.error(e))

        return {
            message: `${data?.filename} uploaded`,
            fileID: fileLink!.id
        }
    })

    fast.get('/download/:id', async (req, repl) => {
        const { id } = req.params as { id: string }

        return `Downloading file with id ${id}`
    })
}


async function bufferFile(multipartFile: MultipartFile): Promise<{ truncated: boolean, buffer: Buffer | null }> {
    const buffer = await multipartFile.toBuffer().catch(_ => { })
    return {
        truncated: multipartFile.file.truncated,
        buffer: buffer === undefined ? null : buffer
    }
}

export default fileRoutes