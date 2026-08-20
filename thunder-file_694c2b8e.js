const settings = {
  async: true,
  crossDomain: true,
  url: "https://www.thunderclient.com/welcome",
  method: "GET",
  headers: {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Content-Type": "application/json"
  },
  data: JSON.stringify({
    "version": "0.2.0",
    "configurations": [
        {
            "name": ".NET Core Attach",
            "type": "coreclr",
            "request": "attach"
        },

        {
            "command": "npm start",
            "name": "Run npm start",
            "request": "launch",
            "type": "node-terminal"
        },
        {
            "name": "Launch Chrome",
            "request": "launch",
            "type": "chrome",
            "url": "http://localhost:5173/",
            "webRoot": "${workspaceFolder}"
        },
        {
            "name": "Debug",
            "type": "comet",
            "request": "launch",
            "preLaunchTask": "comet: Build"
        }
    ]
}),
};

$.ajax(settings).done(function (response) {
  console.log(response);
});