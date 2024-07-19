var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "dotenv/config";
import process from "process";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const filelink = yield prisma.fileLink.create({
        data: {
            link: 'mylink'
        }
    });
    console.log(filelink);
});
main()
    .then(() => {
    prisma.$disconnect();
})
    .catch(e => {
    console.log(e);
    prisma.$disconnect();
    process.exit(1);
});
// const fastify = Fastify({
//     logger: false
// })
// fastify.register(import('@fastify/multipart'), {
//     // attachFieldsToBody: true,
//     limits: {
//         files: 1,
//         // fileSize: 1,
//         fileSize: 1000 * 1000 * 1000
//     }
// })
// fastify.post('/file/upload', async (req, repl) => {
//     // Gets user uploaded file
//     const data = await req.file()
//     if (data === undefined) return;
//     // Buffer file to memory
//     const buffer = await bufferFile(data)
//     if (buffer.truncated) {
//         repl.statusCode = 413
//         return `${data.filename} is too large`
//     }
//     return `${data?.filename} uploaded`;
// })
// async function bufferFile(multipartFile: MultipartFile): Promise<{ truncated: boolean, buffer: Buffer | null }> {
//     const buffer = await multipartFile.toBuffer().catch(_ => { })
//     return {
//         truncated: multipartFile.file.truncated,
//         buffer: buffer === undefined ? null : buffer
//     }
// }
// async function writeToDisk(multipartFile: MultipartFile): Promise<boolean> {
//     const { filename, file } = multipartFile;
//     const filePath = `./uploads/${filename}`;
//     // Buffer user file in memory
//     const filebuffer = await multipartFile.toBuffer()
//     const success = file.truncated
//     // Remove written data if file is too large
//     // if (!success) await fs.rm(filePath)
//     return success
// }
// try {
//     const { PORT, HOST } = process.env
//     fastify.listen({ port: PORT as unknown as number, host: HOST })
// } catch (error) {
//     fastify.log.error(error)
//     process.exit(1)
// }
