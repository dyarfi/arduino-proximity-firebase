# arduino-proximity-firebase
Arduino Node.js with http://johnny-five.io/ and https://firebase.google.com/ --- Firebase Section ---

Change your firebase config in index.html

```
<script>
// Initialize Firebase
var config = {
  	apiKey: "AIzaSyCnCCmWUR9vVDSMxmlcbuEOKGV_jekKEQw",
  	authDomain: "iot-arduino-827cb.firebaseapp.com",
  	databaseURL: "https://iot-arduino-827cb.firebaseio.com",
  	projectId: "iot-arduino-827cb",
  	storageBucket: "iot-arduino-827cb.appspot.com",
  	messagingSenderId: "971124207623"
};
firebase.initializeApp(config);
</script>
```