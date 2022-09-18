import { inbox, outbox } from 'file-transfer';
import { encode } from 'cbor';

const MESSAGE_FILE_NAME = 'messaging4d9b79c40abe.cbor';

const eventHandlers = {
    message: [],
    open: [],
    closed: [],
    error: []
}

// when incoming data arrives - calls all "onmessage" handlers and passes the data
function onMessage(payload) {
    for (let handler of eventHandlers.message) {
        handler(payload)
    }
}

// on app start calls all "onopen" handlers
function onOpen() {
    for (let handler of eventHandlers.open) {
        handler()
    }
}

export const peerSocket = {

    // *** Setters for manual event handler assignments
    set onmessage(handler) {
        eventHandlers.message.push(handler);
    },

    set onopen(handler) {
        eventHandlers.open.push(handler);
    },

    set onclosed(handler) {
        eventHandlers.closed.push(handler);
    },

    set onerror(handler) {
        eventHandlers.error.push(handler);
    },
    // ***


    readyState: 0,
    OPEN: 0,

    addEventListener: function (event, handler) {
        eventHandlers[event].push(handler)
    },

    // simulation of `messaging.peerSocket.send` - sends data externally
    // from device to phone or from phone to device via file transfer
    send: function (data) {
        outbox.enqueue(MESSAGE_FILE_NAME, encode(data))
            .catch(err => {
                for (let handler of eventHandlers.error) {
                    handler(`Error queueing transfer: ${err}`)
                }
            });
    },

}


if (inbox.pop) { // this is a companion

    async function processCompanionFiles() {
        let file;
        let payload = {}

        while ((file = await inbox.pop())) {
            if (file.name === MESSAGE_FILE_NAME) {
                payload.data = await file.cbor();
                onMessage(payload)
            }
        }
    }

    inbox.addEventListener("newfile", processCompanionFiles);

    processCompanionFiles();

} else { // this is a device
    const { readFileSync } = require("fs");

    async function processDeviceFiles() {
        let fileName;
        let payload = {};

        while (fileName = inbox.nextFile()) {
            if (fileName === MESSAGE_FILE_NAME) {
                payload.data = readFileSync(fileName, 'cbor');
                onMessage(payload)
            }
        }
    }

    inbox.addEventListener("newfile", processDeviceFiles)

    processDeviceFiles();

}

setTimeout(() => { onOpen(); }, 1)
