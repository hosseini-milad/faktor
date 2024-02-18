var express = require('express');
require("dotenv").config();
require("./middleware/database").connect();
var expressWinston = require('express-winston');
var winston = require('winston'); // for transports.Console
var app = module.exports = express();
const mime = require('mime');
const fs = require('fs');
const cors = require("cors");
app.use(cors());
 
const mainApi = require('./router/mainApi')
require('winston-daily-rotate-file');

const { API_PORT } = process.env;
const port = API_PORT;

app.get('/hook-lead', (req, res) => {    //Subscribing to an event
  console.log("req")
  eventsEmitter.emit('tqi9z2oj5x1gu3iuqtv1d9pyc1gtfkef');});

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
//app.use(express.methodOverride());
// Let's make our express `Router` first.
var router = express.Router();
router.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.post('/api/image',jsonParser, async(req, res, next)=>{
    
  // to declare some path to store your converted image
  var matches = req.body.base64image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
  response = {};
  if (matches.length !== 3) {
  return new Error('Invalid input string');
  }
   
  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  let decodedImg = response;
  let imageBuffer = decodedImg.data;
  let type = decodedImg.type;
  let extension = mime.extension(type);
  let fileName = `Sharif-${Date.now().toString()+"-"+req.body.imgName}`;
  //console.log(fileName)
  try {
  fs.writeFileSync("./uploads/client/" + fileName, imageBuffer, 'utf8');
  return res.send({"status":"success",url:"uploads/client/"+fileName});
  } catch (e) {
      res.send({"status":"failed",error:e});
  }
})
app.use('/uploads', express.static('uploads'));
router.use(bodyParser.json())
router.get('/error', function(req, res, next) {
  // here we cause an error in the pipeline so we see express-winston in action.
  return next(new Error("This is an error and it should be logged to the console"));
});

router.use('/api', mainApi)
router.use(cors());
// express-winston logger makes sense BEFORE the router
app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({
      //path to log file
      filename: 'logs/log.json',
      level: 'debug'
    })
  ],
  requestWhitelist: ['headers', 'query'],  //these are not included in the standard StackDriver httpRequest
  //responseWhitelist: ['body'],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  dynamicMeta: (req, res) => {
    const httpRequest = {}
    const meta = {}
    if (req) { 
        meta.httpRequest = httpRequest
        httpRequest.requestMethod = req.method
        httpRequest.requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
        httpRequest.protocol = `HTTP/${req.httpVersion}`
        // httpRequest.remoteIp = req.ip // this includes both ipv6 and ipv4 addresses separated by ':'
        //httpRequest.remoteIp = req.ip.indexOf(':') >= 0 ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip   // just ipv4
        httpRequest.label=(res.statusCode===403||res.statusCode===401)?"False":"True"
        httpRequest.requestSize = req.socket.bytesRead
        httpRequest.userAgent = req.get('User-Agent')
        httpRequest.referrer = req.get('Referrer')
    }
    return meta
}
}));

// Now we can tell the app to use our routing code:
app.use(router);

// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      //path to log file
      name: 'file',
      datePattern: 'yyyy-MM-dd',
      prepend:true,
      colorize: true,
      json: true,
      filename: 'logs/error_log',
      maxsize: 50 * 1024 * 1024,
      maxFiles: 10,
      level: 'error'
    })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));

// Optionally you can include your custom error handler after the logging.

app.listen(port, function(){
  console.log("logger listening on port %d in %s mode", this.address().port, app.settings.env);
});