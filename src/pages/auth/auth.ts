import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FirebaseService} from "../../firebase/firebase.service";

export class Form {
  email: string = '';
  password: string = '';
  gender?: string = '';
  name?: string = '';

  reset() {
    this.email = '';
    this.password = '';
    this.gender = '';
    this.name = '';
  }
}

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {
  form: Form = new Form();
  state: any = 'login';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private firebaseService: FirebaseService
  ) {
  }

  ngOnInit() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthPage');
  }

  login() {
    this.firebaseService.login(this.form.email, this.form.password).then(() => {
      // this.navCtrl.push(HomePage);
    });
  }

  signup() {
    this.firebaseService.signup(this.form.email, this.form.password)
      .then((res) => {
        let data = {
          email: this.form.email,
          gender: this.form.gender,
          name: this.form.name,
          uid: res.uid
        };

        return this.firebaseService.addUser(data);
      })
      .then(() => this.firebaseService.login(this.form.email, this.form.password));
  }
}
