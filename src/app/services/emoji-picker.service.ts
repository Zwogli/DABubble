import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmojiPickerService {
  public openEmojiPicker: 'Main' | 'Edit' | 'Reaction' | '' = '';

  constructor() {}

  toggleEmojiPicker(target: 'Main' | 'Edit' | 'Reaction') {
    if (this.openEmojiPicker === target) {
      this.openEmojiPicker = '';
    } else {
      this.openEmojiPicker = target;
    }
  }
}
