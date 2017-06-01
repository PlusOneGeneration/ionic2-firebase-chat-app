import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
import {FirebaseService} from "../../firebase/firebase.service";

@Component({
  selector: 'page-popover-login',
  templateUrl: 'popover-login.html'
})
export class PopoverLoginPage {
  constructor(public viewCtrl: ViewController,
              private firebaseService: FirebaseService) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  logout() {
    this.firebaseService.logout();
    this.close();
  }
}
