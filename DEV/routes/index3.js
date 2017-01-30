var express = require('express');
var multer = require('multer');
var router = express.Router();
var http = require('http');
var app = express();
var session = require('express-session');
var flash = require('connect-flash');
var ConfigFile = require('../config.js');
var path = require('path');
var multer  = require('multer');
var SecurityCheck = require('../controllers/CacheController');
var CacheController = require('../controllers/CacheController');
var AccountController = require('../controllers/AccountController');
var AgencyController = require('../controllers/AgencyController');
var ChatController = require('../controllers/ChatController');
var FavouriteController = require('../controllers/FavouriteController');
var NotificationController = require('../controllers/NotificationController');
var ProcedureController = require('../controllers/ProcedureController');
var TimeController = require('../controllers/TimeController');
var NodeMailerController = require('../controllers/NodeMailerController');
var CatalogController = require('../controllers/CatalogController');
var TestController = require('../controllers/TestController');
var ProcedureFormsController = require('../controllers/ProcedureFormsController');
var UploadFileController = require('../controllers/UploadFileController');
var DownloadController = require('../controllers/DownloadController');
var FillProcedureParams = require('../controllers/FillProcedureParams');

//working
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'D:/deving/uploads'); // Absolute path. Folder must exist, will not be created for you.
  },
  filename: function (req, file, cb) {
       cb(null,Math.random().toString(36).substr(2, 5) +Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({storage: storage});
router.post('/api/upload/file', upload.any(), function(req,res,next) {
    console.log('single', req.files[0].path);
    console.log('files:', req.files);
    console.log('body:', req.body);
    // var ceva = req.files.path;
    var WSoptions =
      {
            host: ConfigFile.WebServiceIP,
            path: ConfigFile.WebServiceURLDIR+'/BRMWrite.svc/execute/Procedures/addProcedureDocument',
            port: ConfigFile.WebServicePORT,
            method: 'POST',
            headers:
              {
                'Content-Type': 'text/plain'
              }
      };

    var reqData = JSON.stringify
      (
        {
            "SessionId": req.sessionID,
            "currentState": "login",
            "method": "execute",
            "procedure": "addProcedureDocument",
            "service": "/BRMWrite.svc",
            "objects":
                  [
                    {
                      "Arguments":
                                       {
                                        "ID_Procedure": parseInt(req.body.ProcedureID),
                                        "Name": req.body.DocName,
                                        "DocumentURL": req.files[0].path,
                                        "Content":"z",
                                        "Value": parseInt(req.body.OfferValue),
                                       }
                    }
                  ]
          }
      );

    var WSrequest = http.request(WSoptions, function(WSres)
      {
          var data = '';
          WSres.on('data', function(chunk)
            {
                data += chunk;
            });
          WSres.on('end', function()
            {
              data = JSON.parse(data);

                if(data.Result == "Security Audit Failed" || data === 'undefined')
                    {
                        // res.redirect ('/logout');
                          console.log("FAILED !!"+JSON.stringify(data));
                    }

                else if (data.ErrorCode != 0 || data === 'undefined')
                    {
                        res.sendStatus("ErrorCode: "+data.Result);
                    }

              else
                {
                    // res.send("ok");
                    res.send("ok");
                }

            });

      });

    WSrequest.write(reqData);
    WSrequest.end();
  });

router.post('/api/download/downloadfile', DownloadController.getDocument)

router.post('/api/generateDetails/get', ProcedureController.generateDetails)
router.post('/api/fillprocedureparams/post', FillProcedureParams.getProcedureParams);

router.post('/api/forms/get', ProcedureFormsController.getForms);

router.get('/test', TestController.test);
router.post('/test', TestController.test);

router.post('/api/download/get', DownloadController.getFormFile);

/* GET home page. */
router.get('/', AccountController.LoginGET);
router.post('/', AccountController.LoginPOST);
//FlashTest
router.get('/flash', function(req, res, next) {
    res.render('flash', {Message: '' });
});

// //AccountController
router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'SALE.ro',
        Message: ''
    });
});

router.get('/register', function(req, res, next) {
    res.render('register', {
        title: 'SALE.ro',
        Message: ''
    });
});

router.post('/register', AccountController.Register);

router.get('/logout', AccountController.Logout);

router.post('/', AccountController.LoginPOST);

//AgencyController
router.get('/api/agency/get', AgencyController.getAgencyDetails);

//CatalogController
router.post('/api/catalog/post', CatalogController.AddProduct);

//NodeMailerController
router.get('/api/nodemailer/get', NodeMailerController.sendMail);

//ChatController
router.get('/api/chat/get', ChatController.getChatHistory);
router.post('/api/chat/add', ChatController.addChatMessage);

//FavouritesController
router.get('/api/favourite/get', FavouriteController.getFavouriteProcedures);
router.post('/api/favourite/add', FavouriteController.setFavouriteProcedure);
// router.post('/api/favourite/update', FavouriteController.index);
router.post('/api/favourite/delete', FavouriteController.resetFavouriteProcedure);

//NotificationController
router.post('/api/notification/get', NotificationController.getAlerts);
// router.get('/api/notification/get', NotificationController.getAlerts);
router.post('/api/editProcedure/variables', ProcedureController.getProcedureVariables);


//ProceduresController
router.get('/api/procedure/get', ProcedureController.getProcedures);
router.post('/api/procedure/add', ProcedureController.addProcedure);
router.post('/api/editprocedure/edit', ProcedureController.editProcedure);
// router.post('/api/procedure/update', ProceduresController.post);
router.post('/api/procedure/delete', ProcedureController.deleteProcedure);

//TimeController
router.get('/api/time/get', TimeController.servertime);
// router.post('/api/upload/file', UploadFileController.post);



//Other
router.get('/dev', function(req, res, next) {
    res.render('dev', {
        title: 'dev',
        Message: ''
    });
});

router.get('/catalog', function(req, res, next) {
    res.render('catalog', {
        title: 'catalog',
        Message: ''
    });
});

module.exports = router;
