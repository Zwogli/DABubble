import { Injectable, inject } from '@angular/core';
import { Message } from '../models/message.class';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class EmojiPickerService {
  firestore: Firestore = inject(Firestore);
  public openEmojiPicker: 'Main' | 'Edit' | 'Reaction' | '' = '';

  constructor() {}

  toggleEmojiPicker(target: 'Main' | 'Edit' | 'Reaction') {
    if (this.openEmojiPicker === target) {
      this.openEmojiPicker = '';
    } else {
      this.openEmojiPicker = target;
    }
  }

  async addReaction(
    currentUser: User,
    chatRecordId: string,
    msg: Message,
    event: any
  ) {
    console.log(event.emoji);

    const emoteID = event.emoji.id;
    const emoteURL = event.emoji.native;
    const docRef = doc(
      this.firestore,
      'chatRecords',
      chatRecordId,
      'messages',
      msg.id
    );

    // Checks for the emoji that may already exists as a reaction
    const emojiIndex: number = this.checkIfAlreadyReacted(msg, emoteID);
    console.log(emojiIndex);

    if (emojiIndex !== -1) {
      const userIndex: number = msg.reactions[emojiIndex].user.findIndex(
        (user) => user.id === currentUser.id
      );
      console.log(userIndex);

      if (userIndex !== -1) {
        // CurrentUser already reacted with this existing emoji
        msg.reactions[emojiIndex].user.splice(userIndex, 1);
        console.log('updating, ', msg.reactions);

        await updateDoc(docRef, {
          reactions: msg.reactions,
        });
      } else {
        // CurrentUser has not reacted with this existing emoji
        msg.reactions[emojiIndex].user.push({
          id: currentUser.id,
          name: currentUser.name,
        });
        await updateDoc(docRef, {
          reactions: msg.reactions,
        });
      }
    }
  }

  checkIfAlreadyReacted(msg: Message, emoteID: string): number {
    return msg.reactions.findIndex((emoji) => emoji.id === emoteID);
  }

  async updateExistingReaction(
    msgRef: DocumentReference<DocumentData>,
    emoteID: string,
    i: number
  ) {}
}
