import { Injectable, inject } from '@angular/core';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storage: Storage = inject(Storage);

  constructor() {}

  /**
   * This functions uploads the given file to the cloud storage in a directory that 
   * can be referenced to the exact message document in the Firestore via the chatRecord
   * Id. It then gets the needed Url to "download"/show the file in the template and
   * stores it in the Message class.
   * 
   * @param input - Given file to be uploaded
   * @param chatRecordId - Document ID for the chatRecord in Firestore 
   * @param msgId - Document ID of the a message in Firestore
   * @returns String with the url to the file in the Cloud Storage
   */
  async uploadFile(
    input: HTMLInputElement,
    chatRecordId: string,
    msgId: string
  ) {
    if (!input.files) return '';
    const file: File = input.files[0];
    if (file) {
      const url = `${chatRecordId}/${msgId}/${file.name}`;
      const storageRef = ref(this.storage, url);
      try {
        await uploadBytesResumable(storageRef, file);
        const downloadUrl = await getDownloadURL(ref(this.storage, url));
        return downloadUrl;
      } catch (error) {
        return '';
      }
    }
    return '';
  }
}
