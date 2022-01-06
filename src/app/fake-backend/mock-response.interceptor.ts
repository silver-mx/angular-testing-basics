import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { delay, dematerialize, materialize, mergeMap, Observable, of } from 'rxjs';
import { Store } from '../shipping/shipping.component';

@Injectable()
export class MockResponseInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const fakeBody = [
      new Store('id_1', 'store_1'),
      new Store('id_2', 'store_2'),
      new Store('id_3', 'store_3')];

    return of(new HttpResponse({
      status: 200, body: fakeBody
    }));
  }

}
