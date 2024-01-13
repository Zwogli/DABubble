import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';

@Component({
  selector: 'app-dialog-channel-member',
  templateUrl: './dialog-channel-member.component.html',
  styleUrls: ['./dialog-channel-member.component.scss'],
})
export class DialogChannelMemberComponent {
  public members: User[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: User[]) {
    this.members = data;
  }
}
