import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmojiPickerService {
  public isOpenMain: boolean = false;
  public isOpenEdit: boolean = false;

  constructor() {}

  toggleEmojiPicker(target: 'Main' | 'Edit') {
    if (target === 'Main') {
      this.isOpenMain = !this.isOpenMain;
    } else {
      this.isOpenEdit = !this.isOpenEdit;
    }
  }
}
