import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { imageFilter } from "./image-filter";

export const multerConfig = {
    storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'profile'),
        filename: (req, file, callback) => {
            const uniqueName = `${randomUUID()}${extname(file.originalname)}`;

            callback(null, uniqueName)
        }
    }),
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}