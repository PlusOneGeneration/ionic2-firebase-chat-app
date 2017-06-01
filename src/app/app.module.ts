import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {IonicStorageModule} from "@ionic/storage";

import {FirebaseModule} from "../firebase/firebase.module";
import {FirebaseService} from "../firebase/firebase.service";

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {PopoverLoginPage} from "../pages/popover-login/popover-login";
import {AuthPage} from "../pages/auth/auth";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PopoverLoginPage,
    AuthPage
  ],
  imports: [
    BrowserModule,
    FirebaseModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PopoverLoginPage,
    AuthPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
