import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class SearchServiceService {
  firestore: Firestore = inject(Firestore);

  public matchedUsers: any = [];

  constructor() {}

  async searchForUser(search: string) {
    // Delete cache and return if search term is shorter than 2
    if (search.length < 2) {
      this.matchedUsers = [];
      console.log(this.matchedUsers);
      return;
    } else {
      // Search for User
      const q = query(
        collection(this.firestore, 'user'),
        where('name', '>=', search),
        where('name', '<=', search + '~')
      );

      const querySnapshot = await getDocs(q);
      this.matchedUsers = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        // Return if User is already in cache
        if (
          this.matchedUsers.some((user: any) => user.id === doc.data()['id'])
        ) {
          return;
        } else {
          // Push found User to cache
          this.matchedUsers.push(doc.data());
          console.log(this.matchedUsers);
        }
      });
      console.log(this.matchedUsers);
    }
  }
}
