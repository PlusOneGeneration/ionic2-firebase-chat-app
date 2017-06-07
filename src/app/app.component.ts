import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {FirebaseService} from "../firebase/firebase.service";
import {AuthPage} from "../pages/auth/auth";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private firebaseService: FirebaseService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.firebaseService.$user.subscribe((user) => {
        if (user && user.uid) {
          this.rootPage = HomePage;
        } else {
          this.rootPage = AuthPage;
        }
      });
    });
  }
}

