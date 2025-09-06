import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetEmailService {
  private _http = inject(HttpClient);

  getEmails(): Observable<string[]>{
    return  this._http.get<string[]>('/assets/json/email-data.json')
      .pipe(
        delay(1500)
      )
  }
}
