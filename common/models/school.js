var validator = require('validator');
var validate = require('../utils/validate');
var util = require('../utils/util');
var constant = require('../utils/constant');

module.exports = function(School) {

    School.beforeRemote('create',function(ctx, unused, next){
        var currentTime = new Date();
        console.log(ctx.args.data);
        var data = ctx.args.data;
        var validatedData = {};
        validatedData.address = {};
        if(validate.isEmpty(data)){
            next(util.getGenericError("Error", 400, "Invalid Data Received"));
            return;
        }
        if(!data.email || !validate.isEmail(data.email)){
            next(util.getGenericError("Error", 400, "Invalid Email"));
            return;
        }
        validatedData.email = data.email;
        if(!data.name || !validator.isLength(data.name, {min:2, max: 100})){
            next(util.getGenericError("Error", 400, "Invalid School Name"));
            return;
        }
        validatedData.name = data.name;
        if(data.mobile && !validator.isNumeric(data.mobile) && !validator.isLength(data.mobile, {min:10, max: 10})){
            next(util.getGenericError("Error", 400, "Invalid Phone number"));
            return;
        }
        validatedData.mobile = data.mobile;
        if(!data.address || !data.address.street || !validate.isStreet(data.address.street)){
            next(util.getGenericError("Error", 400, "Invalid Street"));
            return;
        }
        validatedData.address.street = data.address.street;
        if(!data.address || !data.address.city || !validate.isCity(data.address.city)){
            next(util.getGenericError("Error", 400, "Invalid city"));
            return;
        }
        validatedData.address.city = data.address.city;
        if(!data.address || !data.address.state || !validate.isState(data.address.state)){
            next(util.getGenericError("Error", 400, "Invalid state"));
            return;
        }
        validatedData.address.state = data.address.state;
        if(!data.address || !data.address.pincode || !validate.isPincode(data.address.pincode)){
            next(util.getGenericError("Error", 400, "Invalid pincode"));
            return;
        }
        validatedData.address.pincode = data.address.pincode;
        validatedData.verificationToken = util.getToken(constant.EMAIL_VERIFICATION_TOKEN_LENGTH, function(err, token){
            if(err){
                next(util.getInternalServerError(err));
                return;
            }
            validatedData.emailVerified = false;
            validatedData.activated = false;
            validatedData.created = currentTime;
            validatedData.lastUpdate = currentTime;
            validatedData.emailVerificationTokenTtl = util.addTime(currentTime, constant.EMAIL_VERIFICATION_TOKEN_TIME);
            validatedData.emailVerificationToken = token;
            ctx.args.data = validatedData;
            next();
        });
    });


    School.afterRemote('create', function(ctx, schoolInstance, next){
        schoolInstance.address.create(ctx.args.data.address, function(err, addressInstance){
            if(err){
                next(err);
                return;
            }
            var link = constant.EMAIL_VERIFICATION_TOKEN_LINK.replace('TOKEN_HERE', schoolInstance.emailVerificationToken);
            link =link.replace('ID_HERE', schoolInstance.id);
            util.sendVerificationEmail(schoolInstance.email, link);
            var data = ctx.result;
            ctx.result = {};
            ctx.result.message = "Almost done, Just verify your email";
            ctx.result.data = data;
            ctx.result.status = "200";
            next();
        });
    });

    School.verifyEmail = function(data, cb){
        var currentTime = new Date();
        if(validate.isEmpty(data)){
            next(util.getGenericError("Error", 400, "Invalid Data Received"));
            return;
        }
        School.findOne({where: {id: data.id, emailVerificationToken: data.token}}, function(err, schoolInstance){
            if(err){
                cb(util.getInternalServerError(err));
                return;
            }
            if(schoolInstance && schoolInstance.emailVerificationTokenTtl > currentTime){
                schoolInstance.activated = true;
                schoolInstance.emailVerificationToken = "";
                schoolInstance.save(function(err, newSchoolInstance){
                    if(err){
                        cb(util.getInternalServerError(err));
                        return;
                    }
                    var response = {};
                    response.status = "200";
                    response.message = "Your account has been verified, We will go for manual activation and then will let you know.";
                    response.data = newSchoolInstance;
                    cb(null, response);
                });
            }else{
                cb(util.getGenericError("Error", 400, "Invalid attempt to verify"));
                return;
            }
        });
    }
    School.remoteMethod(
		'verifyEmail',
		{
			description: "verifies email",
			accepts: {arg: 'data', type: 'object', http: function(ctx){ return ctx.req.query;}},
			returns: {arg:'response',type:'object'},
            http: {path: '/verify_email', verb: 'get'}
		}
	);
};
