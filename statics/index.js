var exampleSocket = new WebSocket("ws://localhost:3000/sampleServer");
exampleSocket.send("Here's some text that the server is urgently awaiting!");
