import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  onSnapshot,
  doc,
  collection,
} from '@angular/fire/firestore';
import { Unsubscribe } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);

  singleChat!: any;
  private singleCustomerSubject = new BehaviorSubject<any>(this.singleChat);
  singleChat$ = this.singleCustomerSubject.asObservable();

  unsubSingleChat!: Unsubscribe;

  constructor() {
    this.startSubSingleChat('XJs8a192fOAERg5D9kJg');
  }

  ngOnDestroy() {
    this.unsubSingleChat();
  }

  startSubSingleChat(docId: string) {
    this.unsubSingleChat = this.subSingleChat(docId);
  }

  subSingleChat(docId: string) {
    return onSnapshot(this.getSingleDocRef('chatRecords', docId), (chat) => {
      this.singleChat = chat.data();
      console.log('Chat data: ', chat.data());
      console.log(this.singleChat);
    });
  }

  getSingleDocRef(collId: string, docId: string) {
    return doc(collection(this.firestore, collId, 'messages'), docId);
  }
}
