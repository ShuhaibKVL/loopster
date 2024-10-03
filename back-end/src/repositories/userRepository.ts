
import User,{IUser} from '../models/userModel'

export const createUser = async (userData:IUser):Promise<IUser> => {
    const user = new User(userData)
    console.log(">>>",user)
    const newUser = await user.save()
    console.log(">>>",newUser)
    return newUser;
}

export const findUserByEmailOrUserName = async(email:string,userName:string):Promise<IUser | null> => {
    return await User.findOne({$or:[{email:email},{userName:userName}]})
}

export const isExistUser = async(email : string):Promise<IUser | null> => {
    const isExist = await User.findOne({email:email})
    console.log("isExist :",isExist)
    return isExist
}

export const isVerified = async(email:string):Promise<IUser> => {

    const user = await User.findOne({email:email})
    if(!user){
        throw new Error('User Not found')
    }
    console.log("newUser",user)
    user.isVerified = true
    await user.save()
    
    return user
}
