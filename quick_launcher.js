// Quick launcher that launch an instance of the server and one the client

const spawn = require("child_process").spawn;
const server = spawn("node", ["./server/server.js"]);
const client = spawn("node", ["./client/client.js"]);

server.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
});
client.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
});

server.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
});
client.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
});

server.on("close", (code) => {
    console.log(`Server process exited with code ${code}`);
});
client.on("close", (code) => {
    console.log(`Client process exited with code ${code}`);
});
