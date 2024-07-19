var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import fs from 'fs/promises';
import util from 'util';
import { pipeline } from 'stream';
const pump = util.promisify(pipeline);
import { PrismaClient } from "@prisma/client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import shortUUID from "short-uuid";
const fileRoutes = (fast, opts) => __awaiter(void 0, void 0, void 0, function* () {
    fast.post('/upload', (req, repl) => __awaiter(void 0, void 0, void 0, function* () {
        // Gets user uploaded file
        const data = yield req.file();
        if (data === undefined)
            return;
        // Buffer file to memory
        const buffer = yield bufferFile(data);
        if (buffer.truncated || buffer.buffer === null) {
            repl.statusCode = 413;
            return {
                message: `${data.filename} is too large`
            };
        }
        // Get file extention
        const { filename, fileExtension } = (() => {
            const separatedStr = data.filename.split('.');
            return {
                fileExtension: separatedStr.pop(),
                filename: data.filename
            };
        })();
        // Generate an s3 object key with the file extention
        const objectId = shortUUID.generate().toLocaleLowerCase(), objectKey = `${objectId}.${fileExtension}`;
        // TODO Save file into s3
        const s3client = new S3Client({
            region: process.env.REGION,
            credentials: {
                secretAccessKey: process.env.ACCESS_KEY,
                accessKeyId: process.env.ACCESS_KEY_ID
            }
        });
        const response = yield s3client.send(new PutObjectCommand({
            Key: objectKey,
            Bucket: 'quikfilesbucket',
            Body: buffer.buffer
        }));
        // Build s3 uri link
        const objectURI = `https://quikfilesbucket.s3.ap-southeast-1.amazonaws.com/${objectKey}`;
        // Save file link into database
        const prisma = new PrismaClient();
        const fileLink = yield prisma.fileLink.create({
            data: {
                uri: objectURI,
                name: filename,
                id: objectId
            }
        }).catch(e => console.error(e));
        return {
            message: `${filename} uploaded`,
            fileID: objectId
        };
    }));
    fast.get('/download/:id', (req, repl) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        // Query database for matching id
        const prisma = new PrismaClient({});
        try {
            const query = yield prisma.fileLink.findFirstOrThrow({
                where: { id }
            });
            return {
                name: query.name,
                link: query.uri
            };
        }
        catch (error) {
            repl.statusCode = 404;
            return {
                message: `ID does not exist or is invalid`
            };
        }
    }));
});
function bufferFile(multipartFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const buffer = yield multipartFile.toBuffer().catch(_ => { });
        return {
            truncated: multipartFile.file.truncated,
            buffer: buffer === undefined ? null : buffer
        };
    });
}
export default fileRoutes;
