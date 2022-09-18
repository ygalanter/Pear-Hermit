// Import modules
import { settingsStorage } from "settings";
import { peerSocket } from '../common/fitbit-file-messaging'

console.log("Companion Started");


// A user changes settings
settingsStorage.onchange = evt => {
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  peerSocket.send(data);
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let data = {
        key: key,
        newValue: settingsStorage.getItem(key)
      };
      asap.send(data);
    }
  }
}
