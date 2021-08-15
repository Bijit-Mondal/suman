var express = require("express");
var myParser = require("body-parser");
const fs = require('fs')
var app = express();
var querystring = require('querystring');
const { spawn } = require('child_process');

app.get('/',function(request,response){
    response.writeHead(200, {'content-type':'text/html'})
    fs.createReadStream('index.html').pipe(response)
});

app.get('/mp3/:id', function(request, response) {
    const child = spawn('gnome-terminal',[
      '--',
      'youtube-dl',
      '-f',
      '18',
      `${request.params.id}`
       ]);

child.stdout.on('data', (data)=>{
  console.log(`stdout: ${data}`)
  });
});

app.post('/download',function(request,response){
        let body='';
  request.on('data', chunk => {
            body += chunk.toString();
        });

        // when complete POST data is received
        request.on('end', () => {
            // use parse() method
            body = querystring.parse(body);
            
            // { url: 'https://youtbe.com/watch?v=', format: 120 }
            //console.log(body);

            const child = spawn('gnome-terminal',[
                '--',
                'youtube-dl',
                '-f',
                `${body.format}`,
                `${body.url}`
                 ]);

        child.stdout.on('data', (data)=>{
          console.log(`stdout: ${data}`)
          });
        });
        response.write("Downloading!!");
        response.end();
});
app.listen(8000);