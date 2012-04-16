/*
	@Author: James Browne.
	
	@Brief: This global server will hold the game logic.
	When a client connects it will store them in an array.
	The game will use that array along with the kinect data-
	to position the client in the game.
	All the clients in the game will be drawn using that array.
	
	CONNECTS TO: Browser, LocalServer
	
*/
//====================================================================================================================================================================
//
//										CONNECTION TO LOCAL NODE SERVER
//
//
//====================================================================================================================================================================


// The port to listen for client connctions.
var clientPort = 7541;
// Http protocol 
var http = require('http');
// File serving
var fs = require('fs');
// Validates the existance of files.
var path = require('path');
// Sockets
var io = require('./lib/socket.io');


//Server
var server = http.createServer( function ( request , response ) {
 
    console.log('request starting...');
     
    var filePath = '.' + request.url;
	
    if ( filePath == './' )// Just the root.
        filePath = './index.htm';// Default page, our case the game html page.
         
    var extname = path.extname( filePath );
    var contentType = 'text/html';
	
    switch ( extname ) {
        case '.js':// Serving some script.
            contentType = 'text/javascript';
            break;
        case '.css':// Serving some style
            contentType = 'text/css';
            break;
		case '.png':// We're serving an image.
            contentType = 'image/png';
            break;
    }
     
    path.exists(filePath, function(exists) {// Check to see if the file exists
     
        if (exists) {// REturned from the callback, checking to see if valid.
			// Read file, filePath. Plus a callback
            fs.readFile(filePath, function(error, content) {
                if (error) {
				// If theres and error throw 500
                    response.writeHead(500);
                    response.end();
                }
                else {
				// Otherwise return the file.
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {// Throw 404 if the file isn't there.
            response.writeHead(404);
            response.end();
        }
    });
     
});

var socket = io.listen( server ); 		// Socket IO server instance.

var kinectMap = {};
// Add a connect listener
socket.sockets.on( 'connection', function( client ){
	
	// Can get their ip address as a key?
	gClient = client;
	console.log( "Client "+" connected" );
	
	/*		EXAMPLE USE
	socket.sockets.emit('updatechat', client.username, message );		// send to every1
	socket.sockets.send( 'updatechat', client.username, message );	    // but me
	client.emit('updatechat', "Please enter your user name to chat");	// Only me
	
	*/
	
	/*
		Get the kinect data from the server.
	
	*/
	client.on('kinect', function(  ){
		console.log( "Get the kinect data from the server." );
		client.emit('passClientData', kinectMap);
	});

	/*
		When the user disconnects.. perform this
	*/
	client.on('disconnect', function(){
		// Remove if the player is an active player. So another can join...
		console.log("User disconnected");
	});
	

});// End of 'onConnection'

// Listen for connection
server.listen( 7541 );






//====================================================================================================================================================================
//
//										CONNECTION TO OPENNI
//
//
//====================================================================================================================================================================
var javaPort = 7540;
var javaServer = require('net').createServer();

javaServer.on('listening', function () {

    console.log('Server is listening on for java data on :' + javaPort);
});



javaServer.on('error', function ( e ) {

    console.log('Server error: ');// + e.code);
});



javaServer.on('close', function () {

    console.log('Server closed');
});

var packetCount = 0;
var fullPackets = 0;
var dataBuffer = "";
var packetLength = 0;
var newlineIndex = 0
var kinectSynced = false;

javaServer.on('connection', function ( javaSocket ) {
	
	// Store the address of the java client.
    var clientAddress = javaSocket.address().address + ':' + javaSocket.address().port;
	
	// Log that a client has connected...
    console.log('Java ' + clientAddress + ' connected');
	
	javaSocket.write( '\n' );
	
	// When data is called, do first data listener.
    javaSocket.on('data', function( data ){
		
		packetLength = data.length;
		packetCount++;
		console.log("	");
		console.log("	");
		console.log( packetCount + " packets recieved and "+fullPackets+" have been recieved.");
		console.log("	");
		console.log("	");
		dataBuffer += data;
		
		newlineIndex = dataBuffer.indexOf( '\n' );
		
		if( newlineIndex == -1){
			console.log("There was no end of line");
			javaSocket.write( '\n' );
			return;// If there was no end of package in the data return.
		}
		console.log("There was an end of line detected.");
		kinectMap = JSON.parse( dataBuffer.slice(0, newlineIndex) );
		fullPackets++;
        dataBuffer = dataBuffer.slice(newlineIndex + 1);
		
		
		if( !kinectSynced ){
			kinectSynced = true;
			gClient.emit('kinectSynced', true);
			console.log("The kinect data has began streaming and the browser should connect.");
		}
		javaSocket.write( '\n' );
	});

	// User has disconnected...
    javaSocket.on('close', function() {
	
		gClient.emit('kinectSynced', false);
		console.log("The kinect data has ended streaming and the browser shouldn't connect.");
		console.log( "The packet caount for the client was: "+ packetCount);
		packetCount = 0;
		fullPackets = 0;
		kinectSynced = false;
        console.log('Java ' + clientAddress + ' disconnected');
    });
});

// Listen for connections on the java port specified!
javaServer.listen( 7540);