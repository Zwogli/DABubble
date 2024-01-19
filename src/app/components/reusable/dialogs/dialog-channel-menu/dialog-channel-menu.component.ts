import { Component, Inject, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ChatSubHeaderComponent } from '../../chat/chat-sub-header/chat-sub-header.component';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-dialog-channel-menu',
  templateUrl: './dialog-channel-menu.component.html',
  styleUrls: ['./dialog-channel-menu.component.scss'],
})
export class DialogChannelMenuComponent {
  fireService: FirestoreService = inject(FirestoreService);
  public channel: Channel;
  public createdBy!: string;

  constructor(
    public dialogRef: MatDialogRef<ChatSubHeaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Channel,
    public dialog: MatDialog
  ) {
    this.channel = data;
    console.log(data);
    this.fireService.getSingleDoc('user', data.createdBy).then((data) => {
      if (data) this.createdBy = data['name'];
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
