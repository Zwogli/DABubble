import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';
import { ChatSubHeaderComponent } from '../../chat/chat-sub-header/chat-sub-header.component';

@Component({
  selector: 'app-dialog-channel-member',
  templateUrl: './dialog-channel-member.component.html',
  styleUrls: ['./dialog-channel-member.component.scss'],
})
export class DialogChannelMemberComponent {
  public members: User[];

  constructor(
    public dialogRef: MatDialogRef<ChatSubHeaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User[]
  ) {
    this.members = data;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
