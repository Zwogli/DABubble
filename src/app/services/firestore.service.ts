import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  onSnapshot,
  collection,
  query,
  setDoc,
  doc,
  where,
  getDoc,
  addDoc,
  serverTimestamp,
  orderBy,
} from '@angular/fire/firestore';
import { Unsubscribe } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message.class';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);

  // variable item to observe
  currentUser!: User;
  channelsArray: Channel[] = [];
  singleChatRecord: Message[] = [];

  // subject item
  private currentUserSubject = new BehaviorSubject<User>(this.currentUser);
  private channelsArraySubject = new BehaviorSubject<any>(this.channelsArray);
  private singleChatRecordSubject = new BehaviorSubject<any>(
    this.singleChatRecord
  );

  // observable item
  currentUser$ = this.currentUserSubject.asObservable();
  channelsArray$ = this.channelsArraySubject.asObservable();
  singleChatRecord$ = this.singleChatRecordSubject.asObservable();

  // unsub item
  unsubCurrentUser!: Unsubscribe;
  unsubChatRecord!: Unsubscribe;

  constructor() {}

  ngOnDestroy() {
    this.unsubCurrentUser();
    this.unsubChatRecord();
  }

  async getSingleDoc(colId: string, docId: string) {
    const docSnap = await getDoc(doc(this.firestore, colId, docId));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document found!');
      return;
    }
  }

  getChannelsFromCurrentUser() {
    return onSnapshot(
      //listen to a document, by change updates the document snapshot.
      query(
        //create a query against the collection.
        collection(this.firestore, 'channels'), //select database, collection
        where('member', 'array-contains', this.currentUser.id)
      ), //[path], [action], [searched element]
      (channelsArrays) => {
        //read array[searched element]
        this.channelsArray = []; //reset variable array
        channelsArrays.forEach((doc: any) => {
          //read element of array
          this.channelsArray.push(doc.data()); //element to array
        });
        this.channelsArraySubject.next(this.channelsArray); //update observable

        // console.log('firestore read channelsArray$: ', this.channelsArray, this.channelsArray$);
        // console.log('firestore getChannelsFromCurrentUser: ', channelsArrays.docs);
      }
    );
  }

  subCurrentUser(docId: string) {
    return onSnapshot(doc(this.firestore, 'user', docId), (doc: any) => {
      this.currentUser = doc.data();
      this.currentUserSubject.next(this.currentUser);
      this.getChannelsFromCurrentUser();
      console.log('FirestoreService userData', doc.data());
    });
  }

  startSubUser(docId: string) {
    this.unsubCurrentUser = this.subCurrentUser(docId);
  }

  subChatRecord(docId: string) {
    return onSnapshot(
      query(
        collection(this.firestore, 'chatRecords', docId, 'messages'),
        orderBy('sentAt')
      ),
      (docs: any) => {
        this.singleChatRecord = [];
        docs.forEach((doc: any) => {
          this.singleChatRecord.push(doc.data());
        });
        this.singleChatRecordSubject.next(this.singleChatRecord);
      }
    );
  }

  async addMessage(docId: string, data: Message) {
    const newMsgRef = doc(
      collection(this.firestore, 'chatRecords', docId, 'messages')
    );

    await setDoc(newMsgRef, this.getCleanJson(data, newMsgRef));
  }

  getChatRecordRef() {}

  startSubChat(docId: string) {
    this.unsubChatRecord = this.subChatRecord(docId);
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

  getCleanJson(data: Message, doc: any): {} {
    return {
      id: doc.id,
      message: data.message,
      sentById: data.sentById,
      sentByName: data.sentByName,
      sentByPhotoUrl: data.sentByPhotoUrl,
      sentAt: serverTimestamp(),
      thread: data.thread,
      reactedBy: data.reactedBy,
    };
  }
}
