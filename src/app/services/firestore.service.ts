import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  onSnapshot,
  collection,
  query,
  setDoc,
  doc,
  DocumentData,
} from '@angular/fire/firestore';
import { Unsubscribe } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
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

  currentUser: any[] = [];
  currentUserSubject = new BehaviorSubject<any>(this.currentUser);
  currentUser$ = this.currentUserSubject.asObservable();

  unsubChatRecord!: Unsubscribe;
  unsubCurrentUser!: Unsubscribe;

  constructor() {}

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

  getAllUser() {
    return collection(this.firestore, 'user');
  }

  getCurrentUserRef(docId: string) {
    return doc(collection(this.firestore, 'user'), docId);
  }

  getCurrentUserDoc(userId: string) {
    return onSnapshot(this.getCurrentUserRef(userId), (element) => {
      console.log(element.data());
    });
  }

  getCurrentUser(userId: string) {
    return onSnapshot(
      query(collection(this.firestore, 'user')),
      (docs: any) => {
        this.currentUser = [];
        docs.forEach((doc: any) => {
          this.currentUser.push(doc.data());
        });
        this.currentUserSubject.next(this.currentUser);
        console.log(this.currentUser);
      }
    );
  }

  startSubChat(docId: string) {
    this.unsubChatRecord = this.subChatRecord(docId);
  }

  giveUserIdToService(userId: string) {
    onSnapshot(this.getCurrentUserRef(userId), (element) => {
      console.log(element.data());
      this.currentUser = [];
      //this.currentUser = element.data();
      this.currentUser.push(element.data());
      console.log(this.currentUser);
      this.currentUserSubject.next(this.currentUser);
    });
    console.log(this.currentUser);
    console.log(this.currentUser$);
  }

  async addUser(userObject: any, name: string) {
    await setDoc(doc(this.firestore, 'user', userObject.uid), {
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
