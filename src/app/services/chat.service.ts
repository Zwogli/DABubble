import { Injectable, inject } from '@angular/core';
import { Message } from '../models/message.class';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { chatTypes } from '../interfaces/chats/types';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  firestore: Firestore = inject(Firestore);

  public leadingThreadMsg!: any;
  public leadingThreadMsgId!: string;
  public channelId!: string;

  private chatRecordId!: string;
  private chatRecordIdSubject = new Subject<string>();
  chatRecordIdChanged$ = this.chatRecordIdSubject.asObservable();

  private threadChatRecordId!: string;
  private threadChatRecordSubject = new Subject<string>();
  threadChatRecordIdChanged$ = this.threadChatRecordSubject.asObservable();

  constructor(private router: Router) {}

  async startThreadFromChannel(
    msgId: string,
    channelId: string,
    chatRecordId: string
  ) {
    this.chatRecordId = chatRecordId;
    this.channelId = channelId;
    this.leadingThreadMsgId = msgId;
    await this.setLeadingMsg(msgId);
    await this.addNewChatRecord('thread', this.chatRecordId, msgId);
    this.router.navigate(['/thread/', msgId, this.channelId]);
  }

  async setLeadingMsg(msgId: string) {
    const docRef = doc(
      this.firestore,
      'chatRecords',
      this.chatRecordId,
      'messages',
      msgId
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      this.leadingThreadMsg = docSnap.data();
    }
  }

  async navigateBack(src: chatTypes) {
    const msgThread = this.leadingThreadMsg.thread;

    if (src === 'thread' && msgThread.length === 0) {
      await this.deleteChatRecord(this.leadingThreadMsg.id);
      this.deleteMsgChatRecordRef(this.chatRecordId, this.leadingThreadMsg.id);
    }

    this.router.navigate(['/home/', this.channelId]);
  }

  setChatRecordId(chatRecordId: string) {
    this.chatRecordIdSubject.next(chatRecordId);
  }

  setThreadChatRecordId(chatRecordId: string) {
    this.threadChatRecordSubject.next(chatRecordId);
  }

  async addNewChatRecord(
    target: chatTypes,
    chatRecordId: string,
    msgId: string
  ) {
    const newChatRecordRef = doc(collection(this.firestore, 'chatRecords'));
    await setDoc(newChatRecordRef, {});

    if (target === 'thread') {
      const msgRef = doc(
        this.firestore,
        'chatRecords',
        chatRecordId,
        'messages',
        msgId
      );
      await updateDoc(msgRef, {
        'thread.id': newChatRecordRef.id,
      });
    }
  }

  async deleteChatRecord(docId: string) {
    await deleteDoc(doc(this.firestore, 'chatRecords', docId));
  }

  async deleteMsgChatRecordRef(docId: string, msgId: string) {
    const msgRef = doc(this.firestore, 'chatRecords', docId, 'messages', msgId);
    await updateDoc(msgRef, {
      'thread.id': '',
    });
  }
}
