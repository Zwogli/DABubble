import { Component, Input } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Message } from 'src/app/models/message.class';
import { chatTypes } from 'src/app/interfaces/chats/types';
import { ChatService } from 'src/app/services/chat.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent {
  @Input() currentChatRecordId!: string;
  @Input() parentChat!: chatTypes;
  public msgPayload!: string;
  public fileToUpload!: any;

  constructor(
    private fireService: FirestoreService,
    private storageService: StorageService,
    private chatService: ChatService
  ) {}

  /**
   * Sends the message to the corresponding chatRecord and checks if
   * the given chatRecord is for a thread or not. If so, the meta data
   * for the thread gets updated accordingly.
   *
   */
  sendMessage() {
    const data = new Message(this.setMsgData());
    this.fireService.addMessage(
      this.currentChatRecordId,
      data,
      this.fileToUpload
    );
    this.msgPayload = '';
    this.checkParentType();
  }

  setMsgData() {
    const user = this.fireService.currentUser;
    return {
      message: this.msgPayload,
      sentById: user.id,
      sentByName: user.name,
      sentByPhotoUrl: user.photoUrl,
    };
  }

  checkParentType() {
    if (this.parentChat === 'thread') {
      this.chatService.updateThreadMetaData();
    }
  }

  openFileUpload() {
    document.getElementById('fileUpload')?.click();
  }

  onFileChange(event: any) {
    const input = event.target;
    this.fileToUpload = input;
    let src = URL.createObjectURL(input.files[0]);
    let thumbnail = document.getElementById('filePreview');

    thumbnail?.setAttribute('src', src);
    console.log(thumbnail);
  }
}
