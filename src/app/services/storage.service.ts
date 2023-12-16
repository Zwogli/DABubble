import { Injectable, inject } from '@angular/core';
import { Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storage: Storage = inject(Storage);

  constructor() { }
}
