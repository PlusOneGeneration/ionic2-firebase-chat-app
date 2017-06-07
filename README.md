# Ionic 2 Firebase-chat-app

It's a simple chat application based on Firebase Auth and Firebase DB components and wrapped with Ionic 2

## Auth part

![Auth](https://github.com/PlusOneGeneration/ionic2-firebase-chat-app/blob/master/src/assets/screenshots/screenshot_ionic2_001.png)

## Main (chat) part

![Chat](https://github.com/PlusOneGeneration/ionic2-firebase-chat-app/blob/master/src/assets/screenshots/screenshot_ionic2_002.png)

## Online users in sidebar

![Sidebar](https://github.com/PlusOneGeneration/ionic2-firebase-chat-app/blob/master/src/assets/screenshots/screenshot_ionic2_003.png)

## Popover with logout functionality

![Logout](https://github.com/PlusOneGeneration/ionic2-firebase-chat-app/blob/master/src/assets/screenshots/screenshot_ionic2_004.png)

## Install

* Clone: `git@github.com:PlusOneGeneration/ionic2-firebase-chat-app.git` or `https://github.com/PlusOneGeneration/ionic2-firebase-chat-app.git`
* Inside project you just need to run `npm i` to install all packages
* To use your Firebase just put credentials to`src/environments/environment.ts` 
* Last step run: `ionic serve` or `ionic serve -l` it will open default browser with application or go to [`http://localhost:8100/`](http://localhost:8100/) in your browser

## Your own Firebase Credentials

* Go to firebase console [`https://console.firebase.google.com/`](https://console.firebase.google.com/) (login or signup)
* Create project
* In Overview -> `Add Firebase to your Web-app` -> Copy credentials
* Put credentials of your Firebase to`src/environments/environment.ts`
