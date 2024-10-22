import { Readable } from "stream";

export interface IS3Service {
    uploadFile(file: Buffer, fileName: string): Promise<string>;
    deleteFile(key: string): Promise<void>;
}

