import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiCaller {
  readonly APIUrl = environment.apiUrl ?? '';
  private typeName: string = '';

  constructor(private http: HttpClient) {
    this.setControllerPath('Home');
  }

  public setControllerPath(controllerPath: string) {
    this.typeName = controllerPath;
  }

  uploadPhotos(formData: FormData): Observable<any> {
    const url = `${this.APIUrl}/${this.typeName}/analyze`;

    return this.http.post(url, formData, {
      headers: new HttpHeaders(),
    });
  }
}
