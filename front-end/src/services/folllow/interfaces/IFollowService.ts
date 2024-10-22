export interface IFollow {
    follower:string,
    following:string,
}

export interface IFollowService {
    follow(data:IFollow):Promise<void>
    unFollow(data:IFollow):Promise<void>
}
