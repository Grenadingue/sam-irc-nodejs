#!/usr/bin/env node

// Quick launcher that launch an instance of the server and one the client

const exec = require("child_process").spawn;
const server = exec("node", ["./server/server.js"]);
const client = exec("./client/node_modules/electron-prebuilt/dist/electron", ["./client/client.js"]);

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
