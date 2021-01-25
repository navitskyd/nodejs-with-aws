import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private UIMessageSubject: BehaviorSubject<string> = new BehaviorSubject('');

  private readonly UIMessage: Observable<string> = this.UIMessageSubject.asObservable();

  url = `http://${environment.apiUrl}:${environment.apiPort}/upload`;

  constructor(private httpClient: HttpClient) { }

  upload(formData: FormData) {
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    formData.forEach((value, key) => {
      console.log(key + ', ' + value);
    })
    const obs = this.httpClient.post(this.url, formData, {
      reportProgress: true,
      observe: 'events',
      headers,
    });
    return obs;
  }

  getUIMessage(): Observable<string> {
    return this.UIMessage;
  }

  setUIMessage(str: string) {
    this.UIMessageSubject.next(str);
  }

}
