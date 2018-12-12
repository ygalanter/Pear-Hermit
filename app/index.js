import clock from "clock";
import document from "document";
import {display} from "display";
import { units } from "user-settings";
import { battery } from "power";
import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";
import {preferences as user_settings} from "user-settings";
import asap from "fitbit-asap/app";
import {preferences} from "fitbit-preferences";
import dtlib from "../common/datetimelib";

const second_hand = document.getElementById("second-hand");
const date = document.getElementById("date");
const activity_icon = document.getElementById("icon");
const background = document.getElementById("bg");
const dial = document.getElementById("bg_image");
const tracker = document.getElementById("tracker");
const minute_inner = document.getElementById("minute_inner");
const minute = document.getElementById("minute");
const minute_outer = document.getElementById("minute_outer");
const minute_root = document.getElementById("minute_root");
const hour_inner = document.getElementById("hour_inner");
const hour = document.getElementById("hour");
const hour_outer = document.getElementById("hour_outer");
const hour_root = document.getElementById("hour_root");
const dot_inner = document.getElementById("dot_inner");
const dot = document.getElementById("dot");
const dot_outer = document.getElementById("dot_outer");

const minute_left = document.getElementById("minute-left");
const minute_right = document.getElementById("minute-right");
const minute_bottom = document.getElementById("minute-bottom");
const minute_top = document.getElementById("minute-top");

const hour_left = document.getElementById("hour-left");
const hour_right = document.getElementById("hour-right");
const hour_bottom = document.getElementById("hour-bottom");
const hour_top = document.getElementById("hour-top");

const minute_hand_opaque_group = document.getElementById("minute-hand-opaque");
const minute_hand_transparent_group = document.getElementById("minute-hand-transparent");
const hour_hand_opaque_group = document.getElementById("hour-hand-opaque");
const hour_hand_transparent_group = document.getElementById("hour-hand-transparent");

let heartrate = '...';

// array of activities to change on user tapping
const on_tap_activity = ['steps','activeMinutes','calories','distance','elevationGain','heartRate','battery', 'digitalTime']

// when user taps anything, advance to the next activity tracking
let on_tap = function(e) {
  let index = on_tap_activity.indexOf(preferences.activity); // getting currently set activity
  if (index == -1) index = 0; // if it wasn't set - start with the first one in the list;
  
  index++;  // switching to the next activity
  if (index == on_tap_activity.length) index = 0; // if we reached end of activity lise - start from the beginning
  
  // saving/stting activity
  preferences.activity = on_tap_activity[index];
  setActivityIcon(preferences.activity);
  updateActivity(preferences.activity);
  
}
dial.onclick = on_tap;
activity_icon.onclick = on_tap;
tracker.onclick = on_tap;
date.onclick = on_tap;

// *** Begin Sweeeping animation of second hand

let callback = (timestamp) => {
  second_hand.groupTransform.rotate.angle = timestamp % 60000 * 3 / 500;
  requestAnimationFrame(callback);
}
requestAnimationFrame(callback);
// *** End Sweeeping animation of second hand


// get user time format preference
dtlib.timeFormat = user_settings.clockDisplay == "12h" ? 1: 0;

//**** date & activity update
clock.granularity = "seconds";

// Update the clock every tick event
let digitalTime;
clock.ontick = (evt) => {
  let today = evt.date;
  
  // getting 0-prepended day of the month
  let day = dtlib.zeroPad(today.getDate());
  date.text = day;

  // *** begin getting digital time
  let hours = dtlib.format1224hour(today.getHours());

  let ampm = dtlib.timeFormat == dtlib.TIMEFORMAT_24H? '': ' ' + dtlib.getAmApm(hours);
  
  if (dtlib.timeFormat == dtlib.TIMEFORMAT_24H) {
      hours = dtlib.zeroPad(hours);
  }
  
  let mins = dtlib.zeroPad(today.getMinutes());

  digitalTime = `${hours}:${mins}${ampm}`;
  // *** end getting digital time
  
  updateActivity(preferences.activity);
}
//**** date & activity update

/* Initial preference load */
if (preferences.transparent_hands == undefined) {
    preferences.background_color = "black";
    preferences.dial_color = "white";
    preferences.hands_color = "red"
    preferences.activity = "steps";
    preferences.transparent_hands = false
}


function setBackgroundColor(color) {
  background.style.fill = color;
  minute_inner.style.fill = color;
  minute_outer.style.fill = color;
  hour_inner.style.fill = color;
  hour_outer.style.fill = color;
  dot_inner.style.fill = color;
}

function setDialColor(color) {
  dial.style.fill = color;
  activity_icon.style.fill = color;
  date.style.fill = color;
  tracker.style.fill = color;
  second_hand.style.fill = color;
  dot.style.fill = color;
}

function setHandsColor(color) {
  minute.style.fill = color;
  minute_root.style.fill = color;
  hour.style.fill = color;
  hour_root.style.fill = color;
  dot_outer.style.fill = color;
  
  minute_left.style.fill = color;
  minute_right.style.fill = color;
  minute_bottom.style.fill = color;
  minute_top.style.fill = color;
  
  hour_left.style.fill = color;
  hour_right.style.fill = color;
  hour_bottom.style.fill = color;
  hour_top.style.fill = color; 
  
}

function setHandsTransparency(is_transpaent) {
  if (is_transpaent) {
    minute_hand_opaque_group.style.display = 'none';
    hour_hand_opaque_group.style.display = 'none';
    minute_hand_transparent_group.style.display = 'inline';
    hour_hand_transparent_group.style.display = 'inline';
  } else {
    minute_hand_opaque_group.style.display = 'inline';
    hour_hand_opaque_group.style.display = 'inline';
    minute_hand_transparent_group.style.display = 'none';
    hour_hand_transparent_group.style.display = 'none';    
  }
    
}


function setActivityIcon(activity) {
  activity_icon.href = `icons/${activity}.png`;
}


function updateActivity(activity) {
  
  switch (activity) {
    
    case 'heartRate':
      tracker.text = heartrate;
      break;
    case 'battery':
      tracker.text = Math.floor(battery.chargeLevel) + '%';
      break;
    case 'distance':

      if (units.distance == 'us') {
          tracker.text = Math.round(today.adjusted[activity]/1609.34*100)/100 + ' mi'
      } else {
          tracker.text = Math.round(today.adjusted[activity]/1000*100)/100 + ' km'
      }
      break;
    case 'activeMinutes':
       let hours = Math.floor(today.adjusted[activity] / 60);          
       var minutes = today.adjusted[activity] % 60;
       tracker.text = `${hours} h ${minutes} min`;
      break
    case 'digitalTime':
        tracker.text = digitalTime;
        break;
    default:
      tracker.text = today.adjusted[activity];
      break;
      
  }
  
  
}


// heart rate
var hrm = new HeartRateSensor();

hrm.onreading = function() {
  if (display.on) {
    heartrate = hrm.heartRate;
  }
}
hrm.start();

display.onchange = () => {
  if (display.on) {
    hrm.start();
  } else {
    hrm.stop();
  }
}




//initial user settings load
setBackgroundColor(preferences.background_color);
setDialColor(preferences.dial_color);
setHandsColor(preferences.hands_color);
setHandsTransparency(preferences.transparent_hands);
setActivityIcon(preferences.activity);
updateActivity(preferences.activity);


asap.onmessage = data => {
  
  switch (data.key) {
    case "background_color": 
          preferences[data.key] = data.newValue.replace(/["']/g, "");
          setBackgroundColor(preferences.background_color);
          break;
     case "dial_color": 
          preferences[data.key] = data.newValue.replace(/["']/g, "");
          setDialColor(preferences.dial_color);
          break;
     case "hands_color": 
           preferences[data.key] = data.newValue.replace(/["']/g, "");
          setHandsColor(preferences.hands_color);
          break;
    case "transparent_hands":
          preferences[data.key] = (data.newValue == "true");
          setHandsTransparency(preferences.transparent_hands);
          break;
     case "activity":
          preferences[data.key] = JSON.parse(data.newValue).values[0].value;
          setActivityIcon(preferences.activity);
          updateActivity(preferences.activity);
          break;
  }
}
