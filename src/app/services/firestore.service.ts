import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  onSnapshot,
  collection,
  query,
  setDoc,
  doc,
  where,
} from '@angular/fire/firestore';
import { Unsubscribe } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message.class';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';
import { Chat } from '../models/chat.class';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);
  chatFilteredUserIds: string[] = [];

  // variable item to observe
  currentUser!: User;
  channelsArray: Channel[] = [];
  chatsArray: Chat[] = [];
  chatBetweenUserData: User[] = [];
  singleChatRecord: Message[] = [];
  // subject item
  private currentUserSubject = new BehaviorSubject<User>(this.currentUser);
  private channelsArraySubject = new BehaviorSubject<any>(this.channelsArray);
  private chatsArraySubject = new BehaviorSubject<any>(this.chatsArray);
  private chatBetweenUserDataSubject = new BehaviorSubject<any>(this.chatBetweenUserData);
  private singleChatRecordSubject = new BehaviorSubject<any>(this.singleChatRecord);
  // observable item
  currentUser$ = this.currentUserSubject.asObservable();
  channelsArray$ = this.channelsArraySubject.asObservable();
  chatsArray$ = this.chatsArraySubject.asObservable();
  chatBetweenUserData$ = this.chatBetweenUserDataSubject.asObservable();
  singleChatRecord$ = this.singleChatRecordSubject.asObservable();
  // unsub item
  unsubCurrentUser!: Unsubscribe;
  unsubChatRecord!: Unsubscribe;
  unsubChatUser!: Unsubscribe;
  // -----------------------------------------------
  constructor() {}
  /* 
  todo idea callback methods:
  Create:
  async addDocGenerateId(collName:string){
  await addDoc( collRef(collName), {
    name: "Tokyo",
    country: "Japan"
    });
  }
  
  READ:
  collRef(coll:string){
    return collection(this.firestore, coll),
  }
  docRef(coll:string, docId:string){
    return doc(this.collRef(coll), docId);
  }
  subDocRef(){
    return query(collection(this.docRef(coll, docId), 'messages'));
  }
  
  UPDATE:
  async updateDocument(coll:string, docId:string){
    await updateDoc(docRef(coll, docId), {
    capital: true
    });
  }
  async updateArray(coll:string, docId:string){
    await updateDoc(docRef(coll, docId), {
        // Atomically add a new region to the "regions" array field.
        // arrayName: arrayUnion("[arrayElement]")
        regions: arrayUnion("greater_virginia")
    });
  }
  
  DELETE:
  async deleteArrayElement(coll:string, docId:string){
    await updateDoc(docRef(coll, docId), {
      // Atomically remove a region from the "regions" array field.
      // arrayName: arrayRemove("[arrayElement]")
      regions: arrayRemove("east_coast")
    });
  }
  */
 subCurrentUser(docId: string) {
   return onSnapshot(doc(this.firestore, 'user', docId), (doc: any) => {
     this.currentUser = doc.data();
     this.currentUserSubject.next(this.currentUser);
     this.getChannelsFromCurrentUser();
     this.getChatFromCurrentUser();
     // console.log('FirestoreService userData', doc.data());
   });
 }
 
 startSubUser(docId: string) {
   this.unsubCurrentUser = this.subCurrentUser(docId);
 }
 
  getChatFromCurrentUser() {
    return onSnapshot(  //listen to a document, by change updates the document snapshot.
    query(//create a query against the collection.
      collection(this.firestore, 'privateChat'), //select database, collection
      where('chatBetween', 'array-contains', this.currentUser.id)
    ), //[path], [action], [searched element]

    (chatsArray) => { //read array[searched element]
      this.chatsArray = []; //reset variable array
      chatsArray.forEach((doc: any) => {  //read element of array
        this.chatsArray.push(doc.data()); //element to array
      });
      this.chatsArraySubject.next(this.chatsArray); //update observable
      // console.log('firestore read chatArray: ', this.chatsArray,'chatArray$', this.chatsArray$);1
      this.getUserIdsChatBetween();
    }
    );
  }

  getUserIdsChatBetween(){
    this.chatFilteredUserIds = [];
    this.chatsArray.forEach((chatBetweenUserIds) => {
      let filteredUserId = chatBetweenUserIds.chatBetween.filter(
        (filterChatUserIds: string) => filterChatUserIds !== this.currentUser.id);
      this.chatFilteredUserIds.push(filteredUserId[0]);
    })
    // console.log('firestore chatUserIdArray: ', this.chatFilteredUserIds);
    this.getUserDataChatBetween();
  }

  getUserDataChatBetween(){
    this.chatBetweenUserData = [];
    this.chatFilteredUserIds.forEach((chatBetweenUserId) =>{
      onSnapshot(
        doc(this.firestore, 'user', chatBetweenUserId), 
          (doc: any) => { 
            this.chatBetweenUserData.push(doc.data());
          }
      );
    });
    console.log('firestore chatBetweenUserData: ', this.chatBetweenUserData, 'firestore chatBetweenUserData$ ', this.chatBetweenUserData$ );
  }

  getChannelsFromCurrentUser() {
    return onSnapshot(  //listen to a document, by change updates the document snapshot.
      query(//create a query against the collection.
        collection(this.firestore, 'channels'), //select database, collection
        where('member', 'array-contains', this.currentUser.id)
      ), //[path], [action], [searched element]
      (channelsArrays) => { //read array[searched element]
        this.channelsArray = []; //reset variable array
        channelsArrays.forEach((doc: any) => {  //read element of array
          this.channelsArray.push(doc.data()); //element to array
        });
        this.channelsArraySubject.next(this.channelsArray); //update observable

        // console.log('firestore read channelsArray: ', this.channelsArray, this.channelsArray$);
      }
    );
  }

  ngOnDestroy() {
    this.unsubCurrentUser();
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
