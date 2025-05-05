const {
    user : userModel
} = require('../models');

class CustomError extends Error {
    constructor(message, statusCode) {
     super(message)
     this.statusCode = statusCode
    }
}

const findUser = async ({email}) => {

    if (!email) {
        throw new Error("email can't be null")
    }

    const findData = await userModel.findOne({
        where: {
            email
        }
    });

    return findData
}

module.exports = {
    findUser
}