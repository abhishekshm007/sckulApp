//contains basic utilities function
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport('smtps://egnessegroup%40gmail.com:qwqwqw123@smtp.gmail.com');
var crypto = require('crypto');
var contsant = require('./constant');

var mailOptions = {
    from: "No-reply <no-reply>", // sender address
    subject: "Verify your email... (SckulApp)", // Subject line
    html: "<b>click here to verify your email LINK_HERE</b>" // html body
}

module.exports = {

    //returns error
    getGenericError : function(name, statusCode, message){
        var error = new Error(message);
        error.name = name;
        error.statusCode = statusCode;
        return error;
    },

    //returns internal server error
    getInternalServerError : function(err)
	{
		console.log(err);
		var error = new Error('Something went wrong, make a retry !');
		error.statusCode = 500;
		error.name = "Oh Ah";
		return error;
	},

    sendVerificationEmail : function(to, link){
        mailOptions.html = mailOptions.html.replace("LINK_HERE", link);
        mailOptions.to = to;
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log("Sending Mail Error "+error);
            }else{
                console.log("Message sent: " + JSON.stringify(response));
            }
        });
    },

    //generate random stringify
    getToken : function(length, cb){
        var len = length || constant.TOKEN_LENGTH;
        crypto.randomBytes(len, function(ex, token) {
                if (ex) cb(ex);
                if (token)  cb(null, token.toString('hex'));
                else cb((new Error('Problem when generating token')));
            });
    },

    //add time
    addTime : function(currentTime, duration)
	{
		return new Date(currentTime.getTime() + duration*60000); // 60000 is for converting minute to sec
	},
}
