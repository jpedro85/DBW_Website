// checks  if String from conteins uppercase lether
function strContain_UperAndLower (str) {
    return /\p{Lu}/u.test(str) && /\p{Ll}/u.test(str);
}

// checks  if String for numbers
function strContain_Numbers (str) {
    return str.match(/\d/);
}

// checks  if String for symboles
function strContain_Symbols(str) {
    return /[\p{P}\p{S}]/u.test(str)
}
/**
 * returns a msg if INvalid 
 *
 * @param   {String}  str  
 */
function is_Password_Invalid(str) {

    if(str.length < 8 || str.length > 64  )
        return "Must have at least 8 and at most 64 characters."

    else if ( !strContain_UperAndLower(str) ) 
        return "Must have lower and uppercase characters.";

    else if ( !strContain_Numbers(str) ) 
        return "Must have at least one number."

    else if ( !strContain_Symbols(str) )
        return "Must have at least one symbol.";
    else
        return false;
}   
/**
 * returns a msg if INvalid 
 *
 * @param   {String}  str  
 */
function is_Username_Invalid(str) {

    if(str.length < 8 || str.length > 25  ){
        return "Must have at least 8 and at most 25 characters."
    }else
        return false;
}  

/**
 * Returns true if all object properties are defined
 *
 * @param   {Object}  object  [Object to validate]
 *
 * @param  {[properties]} properties [String]
 */
function validateObject(object,...properties) {

    for(let propertie of properties ){
        
        // if (!object[propertie] && object[propertie]!=""){
        if (!object.hasOwnProperty(propertie)){
                return false;
        }
    }

    return true
}
/**
 * Return true if value is one of the enumeration_values, false otherwise.
 *
 * @param   {any}  value               
 * @param   {any}  enumeration_values  
 *
 * @return  {boolean}                  
 */
function validateEnum(value,...enumeration_values) {

    for(let enum_value of enumeration_values ){

        if (value === enum_value ) 
            return true;
    }

    return false
}
            
module.exports = {validateEnum ,validateObject , strContain_UperAndLower , strContain_Numbers , strContain_Symbols , is_Password_Invalid ,  is_Username_Invalid }


