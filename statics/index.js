var socket = new WebSocket("ws://localhost:3000/sampleServer");

// Connection opened
socket.addEventListener("open", function (event) {
  console.log("[Client] Connection opened");
  socket.send(
    JSON.stringify({
      method: "initialize",
      id: "1",
      params: {
        rootUri: "file:///Users/dolevh/code/personal/hebrew-touch-typing",
        trace: "verbose",
        initializationOptions: {
          logVerbosity: "verbose",
        },
        capabilities: {
          workspace: {
            symbol: {
              resolveSupport: {
                properties: [],
              },
            },
            workspaceFolders: [
              {
                uri: "file:///Users/dolevh/code/personal/hebrew-touch-typing",
                name: "test",
              },
            ],
          },
        },
      },
    })
  );
  setTimeout(() => {
    socket.send(
      JSON.stringify({
        id: "1",
        method: "workspace/symbol",
        params: {
          query: "",
        },
      })
    );
  }, 500);
});

// Listen for messages
socket.addEventListener("message", function (event) {
  const body = document.querySelector("body");
  console.log("body", body);
  const p = document.createElement("pre");
  p.textContent = JSON.stringify(JSON.parse(event.data), undefined, 2);
  body.appendChild(p);
  console.log("[Client] Message from server ", JSON.parse(event.data));
});
