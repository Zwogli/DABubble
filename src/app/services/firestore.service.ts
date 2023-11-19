import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  onSnapshot,
  collection,
  query,
  setDoc,
  deleteDoc,
  doc,
  where,
  getDoc,
  updateDoc,
  QuerySnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  getDocs,
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
  privateChats: Chat[] = [];
  chatUserData: User[] = [];

  singleChatRecord: Message[] = [];

  // subject item
  private currentUserSubject = new BehaviorSubject<User>(this.currentUser);
  private channelsArraySubject = new BehaviorSubject<any>(this.channelsArray);
  private privateChatsSubject = new BehaviorSubject<any>(this.privateChats);
  private chatUserDataSubject = new BehaviorSubject<any>(this.chatUserData);
  private singleChatRecordSubject = new BehaviorSubject<any>(
    this.singleChatRecord
  );

  // observable item
  currentUser$ = this.currentUserSubject.asObservable();
  channelsArray$ = this.channelsArraySubject.asObservable();
  privateChats$ = this.privateChatsSubject.asObservable();
  chatUserData$ = this.chatUserDataSubject.asObservable();
  singleChatRecord$ = this.singleChatRecordSubject.asObservable();

  // unsub item
  unsubCurrentUser!: Unsubscribe;

  currentSignUpData: any = [];
  currentSignUpId: any = (125478986565 * Math.random()).toFixed(0);
  existingEmail: number = 0;
  emailAlreadyExist = false;
  channelAlreadyExist:boolean = false;
  newChannelName:string = '';
  newChannelDescription:string = '';

  unsubChatRecord!: Unsubscribe;
  unsubChatUser!: Unsubscribe;

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

  subCurrentUser(docId: string) {
    return onSnapshot(doc(this.firestore, 'user', docId), (doc: any) => {
      this.currentUser = doc.data();
      this.currentUserSubject.next(this.currentUser);
      this.getChannelsFromCurrentUser();
      this.getChatsFromCurrentUser();
    });
  }

  startSubUser(docId: string) {
    this.unsubCurrentUser = this.subCurrentUser(docId);
  }

  getChatsFromCurrentUser() {
    onSnapshot(query(collection(this.firestore, 'privateChat'), //select database, collection
      where('chatBetween', 'array-contains', this.currentUser.id)), //[path], [action], [searched element]
      (userInChats) => { //read array[searched element]
      this.renderChatsInArray(userInChats)
      this.getUserIdsFromChat();
    });
  }

  renderChatsInArray(userInChats:QuerySnapshot){
    this.privateChats = []; //reset variable array
    userInChats.forEach((doc: any) => {  //read element of array
      this.privateChats.push(doc.data()); //element to array
      this.privateChatsSubject.next(this.privateChats); // update privateChats
    });
  }

  getUserIdsFromChat() {
    this.chatFilteredUserIds = [];
    this.chatFilteredUserIds.push(this.currentUser.id)
    this.privateChats.forEach((chatBetween) => {
     if(chatBetween.id !== this.currentUser.id){
       let filteredUserId = this.filterUserId(chatBetween);
        this.chatFilteredUserIds.push(filteredUserId[0]);
     }
    })
    this.getUserDataFromChat();
  }

  filterUserId(chatBetween:Chat){
    return chatBetween.chatBetween.filter(
      (filterUserIds: string) => filterUserIds !== this.currentUser.id);
  }


  async getUserDataFromChat(){
    this.chatUserData = [];
    this.chatFilteredUserIds.forEach((chatBetweenUserId) =>{
      return onSnapshot(
        doc(this.firestore, 'user', chatBetweenUserId), 
          (doc: any) => { 
            this.chatUserData.push(doc.data());
            this.chatUserDataSubject.next(this.chatUserData);
          });
        });
  }

  getChannelsFromCurrentUser() {
    return onSnapshot(  //listen to a document, by change updates the document snapshot.
      query(//create a query against the collection.
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
      }
    );
  }

  startSubChat(docId: string) {
    this.unsubChatRecord = this.subChatRecord(docId);
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

  async addUser(userObject: any, name: any, photoUrl: any) {
    await setDoc(doc(this.firestore, 'user', userObject?.uid), {
      name: name,
      email: userObject?.email,
      id: userObject?.uid,
      photoUrl: photoUrl,
      onlineStatus: true,
      memberInChannel: [],
      activePrivateChats: [],
    });
  }


  async updateCurrentUserData(userId:string, userName: string, userEmail:string){
    await updateDoc(doc(this.firestore, 'user', userId), {
      name: userName,
      email: userEmail,
    });
  }

  async addPrivateChat(uId:any) {
    await setDoc(doc(this.firestore, 'privateChat', uId), {
      id: uId,
      chatBetween: [uId],
      chatRecord: '',
    });
  }

  async addNewChannel(uId:string, member:User[]){   
    const newChannelRef = doc(collection(this.firestore, 'channels'));

    await setDoc(newChannelRef, this.getNewChannelCleanJson(uId, member, newChannelRef));

    // await setDoc(doc(collection(this.firestore, "channels")), {
    //   chatRecord: "",
    //   createdAt: serverTimestamp(),
    //   createdBy: this.currentUser.id,
    //   description: this.newChannelDescription,
    //   id: ,
    //   member: member,
    //   name: this.newChannelName,
    // });
  }

  async addNewChannelWithAllUser(uId:string) {
    let allUserAsMember: User[] = [];
      return onSnapshot(collection(this.firestore, 'user'), (doc: any) => {
        doc.forEach((userDoc: any) => {
          allUserAsMember.push(userDoc.data())
        });
      // allUserAsMember.push(doc.data());
      this.addNewChannel(uId, allUserAsMember);
   });
  }

  async addNewChannelWithSingleUser(uid:string){
    // await setDoc(doc(this.firestore, 'privateChat', uid), {
    //   id: uid,
    //   chatBetween: [uid],
    //   chatRecord: '',
    // });
  }

  async checkSignUpEmail(email: string) {
    return onSnapshot(
      query(collection(this.firestore, 'user'), where('email', '==', email)),
      (existingEmail) => {
        this.existingEmail = 0;
        this.existingEmail = existingEmail.docs.length;
        if (existingEmail.docs.length == 1) {
          this.emailAlreadyExist = true;
        } else {
          this.emailAlreadyExist = false;
        }
      }
    );
  }

  async checkChannelExist(channel: string) {
    return onSnapshot(
      query(collection(this.firestore, 'channels'), where('name', '==', channel)),
      (existChannel) => {
        if (existChannel.docs.length == 1) {
            this.channelAlreadyExist = true;
            console.error('Channel name exist already!');
          } else {
            this.channelAlreadyExist = false;
            // console.log('DOESNT EXIST');
          }
      });
  }

  getCleanJson(data: Message, doc: any):{} {
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

  getNewChannelCleanJson(uId:string, member:User[], newChannelRef:any){
  return {
    chatRecord: "",
    createdAt: serverTimestamp(),
    createdBy: uId,
    description: this.newChannelDescription,
    id: newChannelRef.id,
    member: member,
    name: this.newChannelName,
  }
  }

  //The following functions gets the current sign up data to use in choose-avater.component

  getCurrentSignUpDataCol() {
    return collection(this.firestore, 'currentSignUpData');
  }

  getCurrentSignUpDataDoc(docId: any) {
    return doc(collection(this.firestore, 'currentSignUpData'), docId);
  }

  getJsonOfCurrentSignUpData(docId: string) {
    onSnapshot(this.getCurrentSignUpDataDoc(docId), (list) => {
      this.currentSignUpData = list.data();
    });
  }

  async addCurrentSignUpData(name: string, email: string, password: string) {
    await setDoc(
      doc(this.firestore, 'currentSignUpData', this.currentSignUpId),
      {
        name: name,
        email: email,
        password: password,
      }
    );
  }

  async deleteCurrentSignUpData(docId: any) {
    await deleteDoc(this.getCurrentSignUpDataDoc(docId));
    this.currentSignUpData = [];
  }
  
}
