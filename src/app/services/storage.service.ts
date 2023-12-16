import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storage: Storage = inject(Storage);

  constructor() {}

  uploadFile(input: HTMLInputElement, destination: string) {
    if (!input.files) return;

    const files: FileList = input.files;

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const storageRef = ref(this.storage, `${destination}/${file.name}`);
        uploadBytesResumable(storageRef, file);
        console.log('Uploaded: ', file);
      }
    }
  }
}
