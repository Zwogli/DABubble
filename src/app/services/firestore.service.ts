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
  QueryDocumentSnapshot,
  DocumentData,
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
  allUsers!:User[];
  currentUser!: User;
  channelsArray: Channel[] = [];
  privateChats: Chat[] = [];
  chatUserData: User[] = [];
  singleChatRecord: Message[] = [];
  // subject item
  private allUsersSubject = new BehaviorSubject<Array<User>>(this.allUsers);
  private currentUserSubject = new BehaviorSubject<User>(this.currentUser);
  private channelsArraySubject = new BehaviorSubject<any>(this.channelsArray);
  private privateChatsSubject = new BehaviorSubject<any>(this.privateChats);
  private chatUserDataSubject = new BehaviorSubject<any>(this.chatUserData);
  private singleChatRecordSubject = new BehaviorSubject<any>(
    this.singleChatRecord
  );
  // observable item
  allUsers$ = this.allUsersSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();
  channelsArray$ = this.channelsArraySubject.asObservable();
  privateChats$ = this.privateChatsSubject.asObservable();
  chatUserData$ = this.chatUserDataSubject.asObservable();
  singleChatRecord$ = this.singleChatRecordSubject.asObservable();
  // unsub item
  unsubCurrentUser!: Unsubscribe;
  // sign up 
  currentSignUpData: any = [];
  currentSignUpId: any = (125478986565 * Math.random()).toFixed(0);
  existingEmail: number = 0;
  emailAlreadyExist = false;
  // create channel
  channelAlreadyExist:boolean = false;
  newChannelName:string = '';
  newChannelDescription:string = '';
  usersAsMemberChache: User[] = [];
  newChannelRefId!:string;
  searchedUser: User[] = [];

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
      this.getAllUserObservable();
      this.getChannelsFromCurrentUser();
      this.getChatsFromCurrentUser();
    });
  }

  startSubUser(docId: string) {
    this.unsubCurrentUser = this.subCurrentUser(docId);
  }

  getAllUserObservable(){
    return onSnapshot(query(collection(this.firestore, 'user')),
      (users) => {
        this.allUsers = [];
        users.forEach((user: any) => {
          this.allUsers.push(user.data()); 
        });
        this.allUsersSubject.next(this.allUsers);
      }
    );
  }
  //>>>>>>>>>>>>>>>>>>>>>read chats from user

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

  //>>>>>>>>>>>>>>>>>>>>>read chats from user END
  //>>>>>>>>>>>>>>>>>>>>>read channels from user

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

  //>>>>>>>>>>>>>>>>>>>>>read channels from user END

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

 //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>create new channel

  async checkChannelExist(channel: string) {
    this.channelAlreadyExist = false;
    let q = query(collection(this.firestore, 'channels'), 
      where('name', '==', channel));
    let querySnapshot = await getDocs(q);
    querySnapshot.forEach((existChannel:any) => {
      if (existChannel.data().name == channel) {
        this.channelAlreadyExist = true;
        console.error('Channel name exist already!');
      } 
    });
  }

  async getAllUser(){
    this.usersAsMemberChache = [];
    const collRef = collection(this.firestore, "user");
    const getColl = await getDocs(collRef);

    getColl.forEach((user:any) => {
      this.usersAsMemberChache.push(user.data())
    });
  }

  async addNewChannel(uId:string){   
    this.newChannelRefId = '';
    const newChannelRef = doc(collection(this.firestore, 'channels'));
    this.newChannelRefId = newChannelRef.id
    let memberId:string[] = [];
    this.usersAsMemberChache.filter((user) => 
      memberId.push(user.id));
    await setDoc(newChannelRef, this.getNewChannelCleanJson(uId, memberId));
  }

  getNewChannelCleanJson(uId:string, memberId:string[]){
    return {
      chatRecord: "",
      createdAt: serverTimestamp(),
      createdBy: uId,
      description: this.newChannelDescription,
      id: this.newChannelRefId,
      member: memberId,
      name: this.newChannelName,
    }
    }
    
  async updateUsers(){
    this.usersAsMemberChache.forEach((user) => {
      this.updateMemberInChanel(user);      
    })
  }

  async updateMemberInChanel(user:User){
    let newMembership:string[]= user.memberInChannel;
    newMembership.push(this.newChannelRefId);
  
    await updateDoc(doc(this.firestore, 'user', user.id), {
      memberInChannel: newMembership,
    });
  }
  
  async setGetColl(){
    const collRef = collection(this.firestore, "user");
    return await getDocs(collRef);
  }

  //>>>>>>>>>>>>>>>>>>create new channel all user END

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
