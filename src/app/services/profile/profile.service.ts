import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    public authService: AuthService,
    public firestore: AngularFirestore
  ) {}

  async getUserProfileData() {
    try {
      const user = await this.authService.authState.pipe(first()).toPromise();
      if(user) return this.firestore.collection('Users').doc(user.uid).get().toPromise();
    } catch (e) {
      console.log(e);
    }
  }
}
