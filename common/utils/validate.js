// Extends Validator for some validations
var validator = require('validator');

module.exports = {

    //Checks for empty Object
    isEmpty : function(data){
        return !(Object.keys(data).length);
    },

    //validates email
    isEmail : function(email){
        return /\S+@\S+\.\S+/.test(email);
    },


    //validates street
    isStreet : function(street){
        //return /^\s*\S+(?:\s+\S+){2}/.test(street);
        return true;
    },

    //validates city
    isCity : function(city){
        return /^[a-zA-z] ?([a-zA-z]|[a-zA-z] )*[a-zA-z]$/.test(city);
    },

    //validates state
    isState : function(state){
        return /^[a-zA-z] ?([a-zA-z]|[a-zA-z] )*[a-zA-z]$/.test(state);
    },

    //validates pincode
    isPincode : function(pincode){
        return /(^\d{6}$)/.test(pincode);
    }
}
