export enum ErrorMessages {
    // User related error messages
    USER_NOT_FOUND = 'User not found',
    INVALID_CREDENTIAL ='Invalid credential',
    PASSWORD_NOT_MATCH ='Password not matched',
    EMAIL_ALREADY_EXIST = 'Email all ready exist',
    USERNAME_ALREADY_EXIST = 'Username all ready exist',
    BLOCKED = 'Admin blocked',

    // Token related error messages
    TOKEN_VERIFIED_FAILED = 'Invalid Token',
    TOKEN_NOT_FONT = 'Token not fond',

    // Otp related error messages
    INVALID_OTP = 'Invalid Otp',

    // admin
    FAILED_TO_FETCH_USERDATA = 'failed to fetch user data',
    USER_ID_NOT_FONT = 'failed to get user id'

}