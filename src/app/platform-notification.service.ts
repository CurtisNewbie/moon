import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatformNotificationService {

  changeSubject = new Subject();

  constructor() { }

  subscribeChange(): Observable<any> {
    return this.changeSubject.asObservable();
  }

  triggerChange() {
    this.changeSubject.next();
  }

}
