var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
// var smtpTransport = nodemailer.createTransport("SMTP",{
//     service: "Gmail",
//     auth: {
//         user: "abhishekshm007@gmail.com",
//         pass: "AINaa007@"
//     }
// });
var smtpTransport = nodemailer.createTransport('smtps://abhishekshm007%40gmail.com:AINaa007@@smtp.gmail.com');


// setup e-mail data with unicode symbols
var mailOptions = {
    from: "No-reply <no-reply>", // sender address
    to: "abhishm20@gmail.com", // list of receivers
    subject: "Verify your email... (SckulApp)", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello worlddasd ✔</b>" // html body
}

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + JSON.stringify(response));
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});
