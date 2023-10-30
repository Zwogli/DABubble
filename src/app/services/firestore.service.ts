import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  onSnapshot,
  collection,
  query,
  setDoc,
  doc,
} from '@angular/fire/firestore';
import { Unsubscribe } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message.class';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);

  singleChatRecord: Message[] = [];
  private singleChatRecordSubject = new BehaviorSubject<any>(
    this.singleChatRecord
  );
  singleChatRecord$ = this.singleChatRecordSubject.asObservable();

  unsubChatRecord!: Unsubscribe;
  // unsubCurrentUser!: subCurrentUser;

  currentUserData:any;

  constructor() {}

  // subCurrentUser(docId: string) {
  //   return onSnapshot(collection(this.firestore, 'user', docId, 'messages')),
  //     (docs: any) => {
  //       this.singleChatRecord = [];
  //       docs.forEach((doc: any) => {
  //         this.singleChatRecord.push(doc.data());
  //       });
  //       this.singleChatRecordSubject.next(this.singleChatRecord);
  //       console.log(this.singleChatRecord);
  //     };
  // }

  subChatRecord(docId: string) {
    return onSnapshot(
      query(collection(this.firestore, 'chatRecords', docId, 'messages')),
      (docs: any) => {
        this.singleChatRecord = [];
        docs.forEach((doc: any) => {
          this.singleChatRecord.push(doc.data());
        });
        this.singleChatRecordSubject.next(this.singleChatRecord);
        console.log(this.singleChatRecord);
      }
    );
  }

  startSubChat(docId: string) {
    this.unsubChatRecord = this.subChatRecord(docId);
  }


  async addUser(userObject:any, name:string) {
    await setDoc(doc(this.firestore, "user", userObject.uid), {
      name: name,
      email: userObject.email,
      id: userObject.uid,
      photoUrl: '',
      onlineStatus: true,
      memberInChannel: [],
      activePrivateChats: [],
    });
  }

}
