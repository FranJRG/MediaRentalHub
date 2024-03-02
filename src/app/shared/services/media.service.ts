import { Injectable } from '@angular/core';
import { Media } from '../../user/interfaces/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  url:string = 'https://proyectoapi-franjrg.onrender.com/media';

  constructor(private http:HttpClient) { }

  //Obtenemos una media por su id
  getMedia(id:number):Observable<Media>{
    return this.http.get<Media>(`${this.url}/${id}`);
  }
}
