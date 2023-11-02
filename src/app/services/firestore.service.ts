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
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message.class';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);

// observable item
  currentUser$ = this.currentUserSubject.asObservable();
  channelsArray$ = this.channelsArraySubject.asObservable();
  singleChatRecord$ = this.singleChatRecordSubject.asObservable();
// subject item
  private currentUserSubject = new BehaviorSubject<User>(
    this.currentUser);
  private channelsArraySubject = new BehaviorSubject<any>(
    this.channelsArray);
  private singleChatRecordSubject = new BehaviorSubject<any>(
    this.singleChatRecord);
// variable item
  currentUser!: User;
  channelsArray: Channel[] = [];
  singleChatRecord: Message[] = [];
// unsub item
  unsubCurrentUser!: Unsubscribe;
  unsubChatRecord!: Unsubscribe;
// -----------------------------------------------
  constructor() {}
  // todo show Tristan:
  // Create:
  // async addDocGenerateId(collName:string){
  // await addDoc( collRef(collName), {
  //   name: "Tokyo",
  //   country: "Japan"
  //   });
  // }
  // 
  // READ:
  // collRef(coll:string){
  //   return collection(this.firestore, coll), 
  // }
  // docRef(coll:string, docId:string){
  //   return doc(this.collRef(coll), docId);
  // }
  // subDocRef(){
  //   return query(collection(this.docRef(coll, docId), 'messages'));
  // }
  // 
  //UPDATE:
  // async updateDocument(coll:string, docId:string){
  //   await updateDoc(docRef(coll, docId), {
  //   capital: true
  //   });
  // }
  // async updateArray(coll:string, docId:string){
  //   await updateDoc(docRef(coll, docId), {
  //       // Atomically add a new region to the "regions" array field.
  //       // arrayName: arrayUnion("[arrayElement]")
  //       regions: arrayUnion("greater_virginia")
  //   });
  // }
  // 
  // DELETE:
  // async deleteArrayElement(coll:string, docId:string){
  //   await updateDoc(docRef(coll, docId), {
  //     // Atomically remove a region from the "regions" array field.
  //     // arrayName: arrayRemove("[arrayElement]")
  //     regions: arrayRemove("east_coast")
  //   }); 
  // }
  
  getChannelsFromCurrentUser(){
    return onSnapshot(                                            //listen to a document, by change updates the document snapshot.
      query(                                                      //create a query against the collection.
        collection(this.firestore, 'channels'),                   //select database, collection
        where('member', "array-contains", this.currentUser.id)),  //[path], [action], [searched element]
    (channelsArrays) => {                                         //read array[searched element]
      this.channelsArray = [];                                    //reset variable array
      channelsArrays.forEach((doc: any) => {                      //read element of array
        this.channelsArray.push(doc.data());                      //element to array
      })
      this.channelsArraySubject.next(this.channelsArray);         //update observable
      
      // console.log('firestore read channelsArray$: ', this.channelsArray, this.channelsArray$);
      // console.log('firestore getChannelsFromCurrentUser: ', channelsArrays.docs);
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
        // console.log('FirestoreService userData', doc.data());
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
