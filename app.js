const fs = require('fs');
const PORT = process.env.PORT || 5000;

const express = require("express");
const upload = require("express-fileupload"); 
const nodemailer = require('nodemailer');
var convertapi = require('convertapi')('bvmkr0bYlDEE705F');
var bodyParser = require('body-parser')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require('dotenv').config();

const app = express();

app.use((req,res, next) => {    
    const now = (new Date()).toUTCString();
    const log = `${now}:${req.method},${req.url}`;
    fs.appendFile("server.log",log + "\n", (err) => {
        if(err){
            console.log("Unable to open server.log file");
        }
    })
    next();
})

app.use(express.static('public'))
app.use(upload())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    fs.readFile(__dirname + '/views/index.html', 'utf8', (err, text) => {
        res.send(text);
    });
});


app.post('/saveWord', (req, res) => {

    const file = req.files.myFile;
    const fileName = file.name
    
    const enterPath = __dirname + '/resources/' + fileName;
    const extend = '.pdf';
    const outputPath = __dirname + `/resources/${fileName.split(".")[0]}${extend}`;

    function upload(){ 
        file.mv(enterPath, (error) => {
            if (error) {
                console.error(error)
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify({ status: 'error', message: error }))
                return
            }
        })
        setTimeout(()=>{
            convertapi.convert('pdf', {
                File: enterPath
            }, 'docx').then(function(result) {
                result.saveFiles(outputPath);
                let fileName = result.response.Files[0].FileName;
                let url = result.response.Files[0].Url;
                res.send(
                {
                    fileName,
                    url
                });
            });
        },0)

    }
    upload()

})

app.get("/getPdf", (req,res)=>{
    const result =  {
        "path": `${__dirname}/resources/`
    }

    res.json(result)
})
  

app.post('/sendMail', (req, res) => {
    console.log("OK")
    var transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: 'wordtopdf000@gmail.com',
          pass: 'testiranje069@'
        }
      });
      
      var mailOptions = {
        from: `wordtopdf000@gmail.com`,
        to: `${req.body.myMail}`,
        subject: 'Word To PDF',
        attachments: [
            { 
                path: `./resources/${req.body.myFile}`
            }
        ]
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.send("SUCCESS")
})

app.listen(PORT);