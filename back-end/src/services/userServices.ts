// import { createUser, findUserByEmailOrUserName, isExistUser, isVerified } from "../repositories/userRepository";
import User, { IUser } from '../models/userModel'
import bcrypt from 'bcryptjs'
import { generateOtp } from '../utils/otpGenerator'
import { mailSender } from "../utils/mailSender";
// import { verify_Otp } from "../repositories/otpRepository";
import jwt from 'jsonwebtoken'
import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { ObjectId } from 'mongoose';
import { IS3Service } from '../interfaces/S3/IS3Service';
import { string } from 'yup';


export const deleteUnverifiedUsers = async () => {
    try {
        const countOfUsers = await User.find({}).countDocuments()
        const countOfUsersIsVerifeid_false = await User.find({isVerified:false}).countDocuments()
        console.log("countOfUsers :",countOfUsers)
        console.log("count Of Users IsVerifeid = false :",countOfUsersIsVerifeid_false)

        const result = await User.deleteMany({
        isVerified: false,
    });

        console.log(`${result.deletedCount}${Date.now()} unverified users deleted`);
        console.log('delete result is :',result)
    } catch (error) {
        console.error('Error deleting unverified users:', error);
        throw error;
    }
};


export class userServices implements IUserService {
    constructor(
        private userRepository:IUserRepository,
        private s3Service : IS3Service
    ){}

    async findUserByEmail(email: string): Promise<any> {
        console.log('user service findUseByEmail')
        return await this.userRepository.findByEmail(email)
    }

    async findUserByUserName(userName: string): Promise<any> {
        console.log('user service findUseByUserName')
        return await this.userRepository.findByUserName(userName)
    }

    async createUser(userData: IUser): Promise<any> {
        console.log('user service createUser')
        return await this.userRepository.create(userData)
    }

    async verifyUser(_id: ObjectId): Promise<void> {
        return await this.userRepository.verifyUser(_id)
    }

    async findUserById(_id: string): Promise<any> {
        return await this.userRepository.findById(_id)
    }

    async uploadProfileImage(userId: string, file: Buffer, fileName: string): Promise<any> {
        console.log('upload image service invoked...')
        // Upload to S3
        const imageUrl = await this.s3Service.uploadFile(file, fileName);
        console.log('imgUrl :',imageUrl)

        // Update the user's profile with the new image URL
        const updatedUser = await this.userRepository.updateProfileImage(userId, imageUrl);
        console.log('updatedUser :',updatedUser)
        return updatedUser;
    }

    async updateProfile(userId: string, formData: FormData): Promise<any> {
        return await this.userRepository.findByIdAndUpdate(userId,formData)
    }

    async findLatestUsers(userId:string): Promise<any> {
        return await this.userRepository.findLatestUsers(userId)
    }
}

