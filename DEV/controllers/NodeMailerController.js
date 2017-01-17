var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");


exports.sendMail = function(req, res, next)
    {

var transporter = nodemailer.createTransport(smtpTransport({
    host : "cpanel.4esoft.ro",
    port: 465,
    auth : {
        user : "bulie.octavian@kig.ro",
        pass : "buliemm"
    }
}));

var mailOptions = {
    from: 'bulie.octavian@kig.ro', // sender address
    to: 'bulie.octavian@cloudifier.net', // list of receivers
    subject: 'Sale.ro', // Subject line
    text: 'Test', // plaintext body
    html: '<b>This is html test</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
        res.sendStatus(200);
    }
