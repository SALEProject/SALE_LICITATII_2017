var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var ConfigFile = require('../config.js');

exports.sendMail = function(to,subject,html)
    {

  var transporter = nodemailer.createTransport(smtpTransport({
      host : ConfigFile.Mailerhost,
      port: ConfigFile.Mailerport,
      auth : {
          user : ConfigFile.Maileruser,
          pass : ConfigFile.Mailerpass
      }
  }));

  var mailOptions = {
      from: ConfigFile.Maileruser, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: '', // plaintext body
      html: html // html body
  };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
              return true;
        }
