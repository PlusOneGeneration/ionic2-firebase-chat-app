import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Storage} from '@ionic/storage';

import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
// import {Router} from "@angular/router";

@Injectable()
export class FirebaseService {
  app: any;
  auth: any;
  user: Observable<any>;
  $user: BehaviorSubject<any> = new BehaviorSubject(null);

  users: FirebaseListObservable<any[]>;
  messages: FirebaseListObservable<any[]>;
  onlineUsers: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase,
              private storage: Storage,
              public afAuth: AngularFireAuth) {

    this.storage.ready().then(() => {
      this.storage.get('user').then((_user) => {
        let user = this.afAuth.auth.currentUser || JSON.parse(_user);
        if (user) {
          this.$user.next(user);
        } else {
          this.afAuth.auth.signOut();
          this.storage.remove('user');
          this.$user.next(null);
        }
      });
    });

    this.user = afAuth.authState;

    this.messages = this.db.list('/room/messages/');
    this.onlineUsers = this.db.list('/room/online/');
    this.users = this.db.list('/users/');
  }

  signup(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  }

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.$user.next(this.afAuth.auth.currentUser);
        this.storage.set('user', JSON.stringify(this.afAuth.auth.currentUser));
        return this.setUserToRoom(this.afAuth.auth.currentUser.uid)
          .then((_user) => {
            if (!_user) {
              return this.logout();
            }

            return _user;
          })
      });
  }


  logout() {
    return Promise.resolve().then(() => {
      return this.removeUserFromRoom(this.afAuth.auth.currentUser.uid)
        .then(() => {
          this.afAuth.auth.signOut();
          this.$user.next(null);
          return this.storage.remove('user');
        });
    });
  }


  getMessages() {
    return this.db.list('/room/messages', {
      query: {
        orderByChild: 'createdAt'
      }
    }).map((messages) => {
      return messages.sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1);
    });
  }

  bannedUsersCache = {};

  isBannedUser(uid): Promise<any> {
    if (!this.bannedUsersCache[uid]) {
      this.bannedUsersCache[uid] = Promise.resolve().then(() => {
        return new Promise((resolve, reject) => {
          this.db.object('/room/bannedUsers/' + uid).subscribe((user) => {
            if (!user || user.$value === null) {
              return resolve(false);
            }

            return resolve(true)
          }, reject);
        });
      });
    }

    return this.bannedUsersCache[uid];
  }

  sendMessage(message: {$key?: string, text: string}) {
    if (message.$key) {
      return this.db.object('/room/messages/' + message.$key).set(message);
    } else {
      return this.messages.push({
        createdAt: +Date.now(),
        text: message.text,
        author: this.afAuth.auth.currentUser.uid
      });
    }
  }

  deleteMessage(key: string) {
    this.messages.remove(key);
  }

  editMessage(key: string) {
    return new Promise((resolve, reject) => {
      this.db.object('/room/messages/' + key).subscribe((message) => {
        if (!message) {
          return resolve(null);
        }

        return resolve(message)
      }, reject);
    });
  }

  getOnlineUsers() {
    return this.onlineUsers;
  }

  setUserToRoom(uid): Promise<any> {
    return this.getUserData(uid)
      .then((user) => {
        if (!user) {
          return null;
        }

        return this.setOnlineUser(user)
          .then(() => user);
      });
  }

  getOnlineUser(uid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.object('/room/online/' + uid).subscribe((user) => {
        if (!user) {
          return resolve(null);
        }

        return resolve(user)
      }, reject);
    });
  }

  setOnlineUser(user) {
    return this.db.object('/room/online/' + user.uid).set(user);
  }

  removeUserFromRoom(uid) {
    return this.onlineUsers.remove(uid);
  }

  addUser(user) {
    return this.db.object('/users/' + user.uid).set(user);
  }

  usersCache = {};

  getUserData(uid): Promise<any> {
    if (!this.usersCache[uid]) {
      this.usersCache[uid] = Promise.resolve().then(() => {
        return new Promise((resolve, reject) => {
          this.db.object('/users/' + uid).subscribe((user) => {
            if (!user) {
              return resolve(null);
            }

            return resolve(user)
          }, reject);
        });
      });
    }

    return this.usersCache[uid];
  }

  banUser(user: any) {
    return this.db.object('/room/bannedUsers/' + user.uid).set(user)
      .then(() => this.bannedUsersCache[user.uid] = null);
  }

  unBanUser(user: any) {
    return this.db.object('/room/bannedUsers/' + user.uid).remove()
      .then(() => this.bannedUsersCache[user.uid] = null);
  }
}
