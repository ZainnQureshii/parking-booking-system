import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private firestore: AngularFirestore) { }

  async getData(collection: string) {
    return await this.firestore.collection(collection).get().toPromise()
  }
}
