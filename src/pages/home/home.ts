import {Component, ViewChild} from '@angular/core';
import {Content, NavController, PopoverController} from 'ionic-angular';
import {PopoverLoginPage} from "../popover-login/popover-login";
import {FirebaseService} from "../../firebase/firebase.service";
import * as moment from "moment";
import {Observable} from "rxjs";

class Message {
  $key?: string;
  text: string = '';
  createdAt?: any;
  author: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  users: any;

  messages: any;
  message: Message = new Message();
  currentUser: any = null;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              private firebaseService: FirebaseService,
              public popoverCtrl: PopoverController) {
  }

  ngOnInit() {
    this.messages = this.firebaseService.getMessages();

    this.users = this.firebaseService.getOnlineUsers();

    this.firebaseService.$user.subscribe((user) => {
      this.currentUser = user;
    });

    this.messages.subscribe(null, (err) => console.log('>>>>> err', err))
    this.users.subscribe(null, (err) => console.log('>>>>> err', err))

    this.scrollToBottom();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverLoginPage);
    popover.present({
      ev: myEvent
    });
  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      this.firebaseService.$user.subscribe((user) => {
        let _user = user && user.uid || null;
        return resolve(_user);
      })
    });
  }

  send() {
    this.firebaseService.sendMessage(this.message);
    this.message = new Message();
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    });
  }

  dateConvert(date) {
    return moment(date).format('H:m:s (DD/MM/YYYY)');
  }

  isYou(uid) {
    return !!this.currentUser && this.currentUser.uid === uid;
  }

  getUserData(uid) {
    return this.firebaseService.getUserData(uid)
  }

  deleteMessage(key) {
    return this.firebaseService.deleteMessage(key);
  }

  editMessage(key) {
    return this.firebaseService.editMessage(key).then((message: any) => {
      this.message = message;
    });
  }

  checkBanMessages() {
    return this.firebaseService.getMessages().subscribe((messages) => {
      this.messages = Observable.of(messages);
    }, (err) => {
      if (err) {
        this.messages = Observable.of([]);
      }
    });
  }

  banUser(user) {
    return this.firebaseService.banUser(user).then(() => this.checkBanMessages());
  }

  unBanUser(user) {
    return this.firebaseService.unBanUser(user).then(() => this.checkBanMessages());
  }

  isBannedUser(uid): Promise<any> {
    return this.firebaseService.isBannedUser(uid);
  }
}
