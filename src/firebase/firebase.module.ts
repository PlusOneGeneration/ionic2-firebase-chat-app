import { NgModule } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'my-app'),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [FirebaseService],
  exports: []
})
export class FirebaseModule { }
