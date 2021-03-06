/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Shortcuts to DOM Elements.
var recentPostsSection = document.getElementById('recent-posts-list');
var recentMenuButton = document.getElementById('menu-recent');
var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var tempSign = document.getElementById('stemp');
var humdSign = document.getElementById('shumi');
var heatSign = document.getElementById('sheat');
var listeningFirebaseRefs = [];

/**
 * Creates a post element.
 */
function createPostElement(dataKey, dataType, dataMessage, dataTimestamp) {
  var css = (dataType == 'relay_off') ? 'green' : 'red';
  var css = (dataType == 'relay_proximity') ? 'light-blue' : css; 
  var html =
      '<div class="post post-' + dataKey + ' mdl-cell mdl-cell--12-col ' +
                  'mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
        '<div class="mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title mdl-color--'+css+'-600 mdl-color-text--white">' +
            '<h4 class="mdl-card__title-text"></h4>' +
          '</div>' +
          '<div class="header">' +
              '<div>' +
              '<div class="avatar"></div>' +
              '<div class="username mdl-color-text--black"></div>' +
            '</div>' +
          '</div>' +
          '<div class="text"></div>' +          
        '</div>' +
      '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;

  var postElement = div.firstChild;

  //alert(postElement);
  //if (componentHandler) {
    //componentHandler.upgradeElements(postElement.getElementsByClassName('mdl-textfield')[0]);
  //}

    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(dataTimestamp);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  // Set values.
  postElement.getElementsByClassName('text')[0].innerText = formattedTime;
  postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = dataMessage +' @'+formattedTime;
  postElement.getElementsByClassName('username')[0].innerText = dataKey;
  return postElement;
}

/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
  // [START recent_posts_query]
  var recentPostsRef = firebase.database().ref('person').limitToLast(1000);
  
  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
          createPostElement(data.key, data.val().type, data.val().message, data.val().timestamp),
          containerElement.firstChild);
    });
  };

  fetchPosts(recentPostsRef, recentPostsSection);
  listeningFirebaseRefs.push(recentPostsRef);
}

/**
 * Cleanups the UI and removes all Firebase listeners.
 */
function cleanupUi() {
  // Remove all previously displayed posts.
  recentPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';
  
  // Stop all currently listening Firebase listeners.
  listeningFirebaseRefs.forEach(function(ref) {
    ref.off();
  });
  listeningFirebaseRefs = [];
}

/**
 * Displays the given section element and changes styling of the given button.
 */
function showSection(sectionElement, buttonElement) {
  recentPostsSection.style.display = 'none';
  recentMenuButton.classList.remove('is-active');
  
  if (sectionElement) {
    sectionElement.style.display = 'block';
  }
  if (buttonElement) {
    buttonElement.classList.add('is-active');
  }
}

// Bindings on load.
window.addEventListener('load', function() {
    cleanupUi();
    startDatabaseQueries();

    // Bind menu buttons.  
    recentMenuButton.onclick = function() {
        showSection(recentPostsSection, recentMenuButton);
    };

    // stores the lights default database setup
    var light_def = firebase.database().ref('lights');
    light_def.on('value', function(snapshot) {
        // Check default value
        if(snapshot.val()=='on') {            
            signOutButton.classList.remove('mdl-button--colored');
            signInButton.classList.add('mdl-button--colored');
        } else {            
            signInButton.classList.remove('mdl-button--colored');
            signOutButton.classList.add('mdl-button--colored');
        }
    });

    // Bind Sign in button.
    signInButton.addEventListener('click', function() {
        firebase.database().ref('lights').set('on');
        signOutButton.classList.remove('mdl-button--colored');
        this.classList.add('mdl-button--colored');
    });

    // Bind Sign out button.
    signOutButton.addEventListener('click', function() {
        firebase.database().ref('lights').set('off');    
        signInButton.classList.remove('mdl-button--colored');
        this.classList.add('mdl-button--colored');
    });

    var ts_def = firebase.database().ref('weather/temperature'),
        hs_def = firebase.database().ref('weather/humidity'),
        his_def = firebase.database().ref('weather/heat');
        
    ts_def.on('value', function(snapshot) {
        // Check default value
        if(snapshot.val()!=0) {        
            // Create the DOM element from the HTML.
            tempSign.getElementsByClassName('dsensor')[0].innerHTML = snapshot.val()+'&deg; ';
        } else {
            tempSign.style.display = 'none';
            humdSign.style.display = 'none';
            heatSign.style.display = 'none';
        }
    });

    hs_def.on('value', function(snapshot) {
        // Check default value
        if(snapshot.val()!=0) {            
            humdSign.getElementsByClassName('dsensor')[0].innerHTML = snapshot.val();
        } else {
            tempSign.style.display = 'none';
            humdSign.style.display = 'none';
            heatSign.style.display = 'none';
        }
    });

    his_def.on('value', function(snapshot) {
        // Check default value
        if(snapshot.val()!=0) {
            heatSign.getElementsByClassName('dsensor')[0].innerHTML = snapshot.val();
        } else {
            tempSign.style.display = 'none';
            humdSign.style.display = 'none';
            heatSign.style.display = 'none';
        }
    });

    recentMenuButton.onclick();
}, false);
