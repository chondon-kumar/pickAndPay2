class ApiError extends Error {
    constructor (
        statusCode, 
        message = "Someting went wrong", 
        error = [], 
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.error = error
        this.success = false
        this.error = error
        this.data = null
        if(stack){
            this.stack = stack
        }else {
            Error.captureStackTrace(this, this.constractor)
        }
    }
}

export {ApiError}