import { Component, Inject, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ChatSubHeaderComponent } from '../../chat/chat-sub-header/chat-sub-header.component';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SearchServiceService } from 'src/app/services/search-service.service';
import { User } from 'src/app/models/user.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-channel-menu',
  templateUrl: './dialog-channel-menu.component.html',
  styleUrls: ['./dialog-channel-menu.component.scss'],
})
export class DialogChannelMenuComponent {
  fireService: FirestoreService = inject(FirestoreService);
  searchService: SearchServiceService = inject(SearchServiceService);

  public channel: Channel;
  public createdBy!: User;

  constructor(
    public dialogRef: MatDialogRef<ChatSubHeaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Channel,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.channel = data;
    console.log(data);
    this.fireService.getUserDoc('user', data.createdBy).then((data) => {
      if (data) this.createdBy = data;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
