import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SearchServiceService {
  firestore: Firestore = inject(Firestore);

  public matchedUsers: any = [];

  constructor() {}

  async searchForUser(search: string) {
    // Uppercases the first letter to match database
    const formattedSearch = search.charAt(0).toUpperCase() + search.slice(1);

    // Delete cache and return if search term is shorter than 2
    if (formattedSearch.length < 2) {
      this.matchedUsers = [];
      console.log(this.matchedUsers);
      return;
    } else {
      // Search for User
      const q = query(
        collection(this.firestore, 'user'),
        where('name', '>=', formattedSearch),
        where('name', '<=', formattedSearch + '~')
      );

      const querySnapshot = await getDocs(q);
      // Reset cache for every new entry so no filtering is needed,
      // when user backspaces in the input 
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
