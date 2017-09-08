# arduino-proximity-firebase
Arduino Node.js with http://johnny-five.io/ and https://firebase.google.com/ --- Firebase Section ---

See 
``` https://github.com/dyarfi/arduino-proximity-node ```
for node on arduino


Change your firebase config in index.html

```
<script>
// Initialize Firebase
var config = {
  	apiKey: "xxxxxxxxxxxxxxxxxx",
  	authDomain: "xxxxxxxxxxxxxxxxxx.firebaseapp.com",
  	databaseURL: "https://xxxxxxxxxxxxxxxxxx.firebaseio.com",
  	projectId: "xxxxxxxxxxxxxxxxxx",
    // Optional
  	storageBucket: "xxxxxxxxxxxxxxxxxx.appspot.com",  
  	messagingSenderId: "xxxxxxxxxxxxxxxxxx"
};
firebase.initializeApp(config);
</script>
```
