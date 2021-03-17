import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: firebase.User;
  authState: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth) {
    this.authState = firebaseAuth.authState;
    firebaseAuth.authState.subscribe((auth) => {
      this.user = auth;
    });
  }

  login(email: string, password: string) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  signup(email: string, password: string) {
    return this.firebaseAuth.createUserWithEmailAndPassword(email, password);
  }

  logout() {
    return this.firebaseAuth.signOut();
  }

  authenticated() {
    return this.user !== undefined && this.user !== null;
  }
}
