import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChatSubHeaderComponent } from '../../chat/chat-sub-header/chat-sub-header.component';
import { ChatService } from 'src/app/services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SearchServiceService } from 'src/app/services/search-service.service';

@Component({
  selector: 'app-dialog-add-member-to-channel',
  templateUrl: './dialog-add-member-to-channel.component.html',
  styleUrls: ['./dialog-add-member-to-channel.component.scss'],
})
export class DialogAddMemberToChannelComponent {
  chatService: ChatService = inject(ChatService);
  fireService: FirestoreService = inject(FirestoreService);
  searchService: SearchServiceService = inject(SearchServiceService);

  public currentChannel!: any;
  public userIsSelected: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChatSubHeaderComponent>,
    private route: ActivatedRoute
  ) {
    this.route.queryParamMap.subscribe(async (p: any) => {
      const channelId = p['params'].channelID;
      this.currentChannel = await this.fireService.getSingleDoc(
        'channels',
        channelId
      );
    });
  }

  closeDialog() {
    this.searchService.matchedUsers = [];
    this.dialogRef.close();
  }
}
