import { Injectable, OnInit, inject } from '@angular/core';
import { Message } from '../models/message.class';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { chatTypes } from '../interfaces/chats/types';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnInit {
  firestore: Firestore = inject(Firestore);

  public leadingThreadMsg!: any;
  public leadingThreadMsgId!: string;
  public channelId!: string;
  public chatRecordId!: string;

  public threadParentChatRecordId!: string;

  private chatRecordIdSubject = new Subject<string>();
  chatRecordIdChanged$ = this.chatRecordIdSubject.asObservable();

  private threadChatRecordSubject = new Subject<string>();
  threadChatRecordIdChanged$ = this.threadChatRecordSubject.asObservable();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  async startThreadFromChannel(
    msgId: string,
    channelId: string,
    chatRecordId: string
  ) {
    this.chatRecordId = chatRecordId;
    this.channelId = channelId;
    this.leadingThreadMsgId = msgId;
    await this.addNewChatRecord('thread', this.chatRecordId, msgId);
    // await this.setLeadingMsg(msgId);
    this.router.navigate(['/thread/', msgId, this.channelId]);
  }

  openThread(msg: Message, channelId: string) {
    this.router.navigate(['/thread/', msg.id, channelId]);
  }

  async setLeadingMsg(msgId: string, parentChatRecordId: string) {
    this.threadParentChatRecordId = parentChatRecordId;
    const docRef = doc(
      this.firestore,
      'chatRecords',
      this.threadParentChatRecordId,
      'messages',
      msgId
    );
    console.log(docRef);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('LeadingMsg set as: ', docSnap.data());
      this.leadingThreadMsg = docSnap.data();
    }
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

  async navigateBack(src: chatTypes) {
    const msgThread = this.leadingThreadMsg.thread;

    if (src === 'thread' && msgThread.length === 0) {
      await this.deleteChatRecord(msgThread.id);
      console.log('before delete ref msg id is:', this.leadingThreadMsg.id);

      this.deleteMsgChatRecordRef(
        this.threadParentChatRecordId,
        this.leadingThreadMsg.id
      );
    }

    this.router.navigate(['/home/', this.channelId]);
  }

  setChatRecordId(chatRecordId: string) {
    this.chatRecordIdSubject.next(chatRecordId);
  }

  setThreadChatRecordId(chatRecordId: string) {
    this.threadChatRecordSubject.next(chatRecordId);
  }

  async deleteChatRecord(docId: string) {
    console.log(docId);

    await deleteDoc(doc(this.firestore, 'chatRecords', docId));
  }

  async deleteMsgChatRecordRef(docId: string, msgId: string) {
    const msgRef = doc(this.firestore, 'chatRecords', docId, 'messages', msgId);
    await updateDoc(msgRef, {
      'thread.id': '',
    });
  }

  async updateThreadMetaData() {
    console.log('Msg has been send in a thread');
    console.log(this.threadParentChatRecordId);
    console.log(this.leadingThreadMsg.id);
    const threadMetaRef = doc(
      this.firestore,
      'chatRecords',
      this.threadParentChatRecordId,
      'messages',
      this.leadingThreadMsg.id
    );
    console.log(threadMetaRef);

    await updateDoc(threadMetaRef, {
      'thread.lastAnswer': serverTimestamp(),
      'thread.length': increment(1),
    });

    this.setLeadingMsg(this.leadingThreadMsg.id, this.threadParentChatRecordId);
  }
}
