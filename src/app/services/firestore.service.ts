import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  onSnapshot,
  collection,
  query,
  setDoc,
  addDoc,
  doc,
  where,
} from '@angular/fire/firestore';
import { Unsubscribe } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message.class';
import { User } from '../models/user.class';

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

  currentUser!: User;
  private currentUserSubject = new BehaviorSubject<User>(
    this.currentUser
  );
  currentUser$ = this.currentUserSubject.asObservable();

  unsubChatRecord!: Unsubscribe;
  unsubCurrentUser!: Unsubscribe;
  test:any;
  currentSignUpData:any = [];
  // this.test = query(collection(this.firestore, 'channels'), where('member', "in", this.currentUser.id));

  constructor() {}

  getChannelsFromCurrentUser(){
    return onSnapshot(query(collection(this.firestore, 'channels'), where('member', "array-contains", this.currentUser.id)), (channelsArray) => {
      console.log('firestore getChannelsFromCurrentUser: ', channelsArray.docs);
    });
  }

  ngOnDestroy() {
    this.unsubCurrentUser();
  }

  subCurrentUser(docId: string) {
    return onSnapshot(doc(this.firestore, 'user', docId),
      (doc: any) => {
        this.currentUser = doc.data();
        this.currentUserSubject.next(this.currentUser);
        this.getChannelsFromCurrentUser();
        console.log('FirestoreService userData', doc.data());
    });
  };

  startSubUser(docId: string) {
    this.unsubCurrentUser = this.subCurrentUser(docId);
  }

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


  async addUser(userObject: any, name: string, photoUrl:string) {
    await setDoc(doc(this.firestore, 'user', userObject.uid), {
      name: name,
      email: userObject.email,
      id: userObject.uid,
      photoUrl: photoUrl,
      onlineStatus: true,
      memberInChannel: [],
      activePrivateChats: [],
    });
  }


  getCurrentSignUpDataCol() {
    return collection(this.firestore, 'currentSignUpData');
  }


  getCurrentSignUpDataDoc(docId: string) {
    return doc(collection(this.firestore, 'currentSignUpData'), docId);
  }


  getJsonOfCurrentSignUpData(docId: string) {
    onSnapshot(this.getCurrentSignUpDataDoc(docId), (list) => {
      console.log(list.data());
      this.currentSignUpData = list.data();
      console.log(this.currentSignUpData.name);
    });
  }


  async addCurrentSignUpData(name: string, email:string, password:string) {
    // await addDoc(this.getCurrentSignUpDataCol(), item);
    await setDoc(doc(this.firestore, 'currentSignUpData', 'id#current#sign#up#data'), {
      name: name,
      email: email,
      password: password
    });
  }
}
