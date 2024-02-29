import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  unsignedUploadPreset : string = 'amkfctwj';
  cloudName : string = 'dnqf48cwh';

  uploadFile(file: string) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
    const fd = new FormData();
    fd.append('upload_preset', this.unsignedUploadPreset);
    fd.append('tags', 'browser_upload');
    fd.append('file', file);

    return this.http.post(url, fd)
  
  }
}