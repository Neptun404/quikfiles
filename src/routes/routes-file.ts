import { MultipartFields, MultipartFile, MultipartValue } from "@fastify/multipart";
import { FastifyPluginAsync } from "fastify";
// import fs from 'fs/promises';


import fs from 'fs';
import util from 'util';
import path, { join } from 'path';
import { pipeline } from 'stream';
const pump = util.promisify(pipeline)
import { PrismaClient } from "@prisma/client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import shortUUID from "short-uuid";

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


        // Get file extention
        const { filename, fileExtension } = (() => {
            const separatedStr = data.filename.split('.')
            return {
                fileExtension: separatedStr.pop(),
                filename: data.filename
            }
        })()

        // Generate an s3 object key with the file extention
        const objectKey = shortUUID.generate().toLocaleLowerCase()

        // TODO Save file into s3
        const s3client = new S3Client({
            region: process.env.REGION!,
            credentials: {
                secretAccessKey: process!.env.ACCESS_KEY!,
                accessKeyId: process!.env.ACCESS_KEY_ID!
            }
        })
        const response = await s3client.send(new PutObjectCommand({
            Key: objectKey,
            Bucket: 'quikfilesbucket',
            Body: buffer.buffer
        }))

        // Build s3 uri link
        const objectURI = `https://quikfilesbucket.s3.ap-southeast-1.amazonaws.com/${objectKey}.${fileExtension}`

        // Save file link into database
        const prisma = new PrismaClient()
        const fileLink = await prisma.fileLink.create({
            data: {
                uri: objectURI,
                name: filename,
                id: objectKey
            }
        }).catch(e => console.error(e))

        console.log(fileLink);

        return {
            message: `${filename} uploaded`,
            fileID: objectKey
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