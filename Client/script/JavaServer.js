var javaPort = 7451;
var javaServer = require('net').createServer();



javaServer.on('listening', function () {
    console.log('Server is listening on for java data on :' + javaPort);
});



javaServer.on('error', function (e) {
    console.log('Server error: ' + e.code);
});



javaServer.on('close', function () {
    console.log('Server closed');
});

javaServer.on('connection', function ( javaSocket ) {

	// Store the address of the java client.
    var clientAddress = javaSocket.address().address + ':' + javaSocket.address().port;
    console.log('Java ' + clientAddress + ' connected');

    var firstDataListenner = function ( data ) {
        console.log('Received JavaServer.js from java: ' + data);
        javaSocket.removeListener('data', firstDataListenner);
        createNamespace(data, javaSocket);
    }
	
	// When data is called, do first data listener.
    javaSocket.on('data', firstDataListenner);

	// User has disconnected...
    javaSocket.on('close', function() {
	
        console.log('Java ' + clientAddress + ' disconnected');
    });
});

// Listen for connections on the java port specified!
javaServer.listen(javaPort);
