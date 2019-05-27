var app = require('express')();
var http = require('http').createServer(app);
var io = require("socket.io")(http);

var axios = require('axios');
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
    res.sendFile("Opened at PORT "+port);
});
http.listen(port, function(){
    console.log('Application Started at '+port+' PORT');
});

let socketList = io.sockets.server.eio.clients;
let clientsCount = 0;
io.origins(['https://bitechat.herokuapp.com:443','http://bitechat.herokuapp.com:80']);

io.on('connection', function(socket){
    clientsCount++;
    socket.on('incoming_message', function(message){
        if(clientsCount > 1){
            io.emit('receive_message',message);
        }
        else{
            axios.post("https://bitechat.herokuapp.com/send/email",message)
            .then(res=>{
                console.log("Email Notified")
            })
            .catch(error=>{
                console.log(error)
                console.log("Unable to Send Email Notfication")
            })
        }
    });
    
    socket.on('disconnect', function(){
        clientsCount--;
      console.log('user disconnected');
    });
  });