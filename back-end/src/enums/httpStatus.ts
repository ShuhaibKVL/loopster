export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401, //  invalid credentials.
    FORBIDDEN = 403, // doesn’t have permission
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    INVALIDE_CREDENTIAL = 401

}