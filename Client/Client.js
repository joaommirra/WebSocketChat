var connectionUrl = document.getElementById("connectionUrl");
var connectButton = document.getElementById("connectButton");
var stateLabel = document.getElementById("stateLabel");
var sendMessage = document.getElementById("sendMessage");
var sendButton = document.getElementById("sendButton");
var commsLog = document.getElementById("commsLog");
var closeButton = document.getElementById("closeButton");
var recipents = document.getElementById("recipents");
var connID = document.getElementById("connIDLabel");

connectionUrl.value = "ws://localhost:5000";

connectButton.onclick = function () {
    stateLabel.innerHTML = "Attempting to connect...";
    socket = new WebSocket(connectionUrl.value);
    socket.onopen = function (event) {
        updateState();
        commsLog.innerHTML += '<tr>' +
            '<td colspan="3">Connection opened</td>' +
            '</tr>'
    };

    socket.onclose = function (event) {
        updateState();
        commsLog.innerHTML += '<tr>'
                            + '<td colspan="3">Connection closed. Code: ' + htmlEscape(event.code)
                            + ' Reason: ' + htmlEscape(event.reason) 
                            + '</td></tr>'
        '</tr>';
    };

    socket.onerror = updateState();
    socket.onmessage = function (event) {
        commsLog.innerHTML += '<tr>'
                            + '<td>Server</td>'
                            + '<td>Client</td>'
                            + '<td>' + htmlEscape(event.data) + '</td></tr>'
        '</tr>';
    };

    function htmlEscape(str) {
        return str.toString()
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
    }

    function updateState() {
        function disable() {
            sendMessage.disable = true;
            sendButton.disable = true;
            closeButton.disable = true;
            recipents.disable = true;
        }

        function enable() {
            sendMessage.disable = false;
            sendButton.disable = false;
            closeButton.disable = false;
            recipents.disable = false;
        }

        connectionUrl.disable = true;
        connectButton.disable = true;
        if (!socket) {
            disable();
        } else {
            console.log(event.reason);
            switch (socket.readyState) {
                case WebSocket.CLOSED:
                    stateLabel.innerHTML = "Closed";
                    connID.innerHTML = "ConnID: N/a";
                    disable();
                    connectionUrl.disable = false;
                    connectButton.disable = false;
                    break;
                case WebSocket.CLOSING:
                    stateLabel.innerHTML = "Closing...";
                    disable();
                    break;
                case WebSocket.OPEN:
                    stateLabel.innerHTML = "Open";
                    enable();
                    break;
                default:
                    stateLabel.innerHTML = "Unknown WebSocket State: " + htmlEscape(socket.readyState);
            }
        }
    }

}