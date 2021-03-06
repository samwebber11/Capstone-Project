const Validator = require("validator");
const isEmpty = require("is-empty");

const validationFunction  = (data) => {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name: "";
    data.email = !isEmpty(data.email) ? data.email: "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmPasswd = !isEmpty(data.confirmPasswd) ? data.confirmPasswd : "";

    if(Validator.isEmpty(data.name)) {
        errors.name = "UserName is required";
    }
    
    if(Validator.isEmpty(data.email))
    {
        errors.email = "Email field is required";
    } else if(!Validator.isEmail(data.email)) {
        errors.email = "Email entered is invalid";
    }

    if(Validator.isEmpty(data.password))
    {
        errors.password = "Password is mandatory"
    }
    if(!Validator.isLength(data.password, {min: 8,max:12})) {
        errors.password = "Password must be between 8 and 12 characters";
    }

    if(!Validator.equals(data.password,data.confirmPasswd))
    {
        errors.confirmPasswd = "Passwords do not match";
    }

    return {
        errors,
        isValid : isEmpty(errors)
    };
};

module.exports = validationFunction;