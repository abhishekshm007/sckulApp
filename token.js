var crypto = require('crypto');
crypto.randomBytes(20, function(ex, token) {
        if (ex) console.log(ex);;

        if (token)  console.log(token.toString('hex'));
        else console.log((new Error('Problem when generating token')));
    });
