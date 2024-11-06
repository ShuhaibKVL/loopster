import mongoose, { ClientSession } from "mongoose";

class TransactionSessionManager {
    static async startSession(): Promise<ClientSession> {
        return mongoose.startSession();
    }
}

export default TransactionSessionManager;
