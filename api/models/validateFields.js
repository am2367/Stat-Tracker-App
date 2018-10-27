const validateFields = (req) => {
    console.log("Validating Fields")

    //loop through request fields and check if empty
    for(let param in req){
        if(req.param === ""){
            return false;
        }
    }
    return true;
}
module.exports = validateFields;