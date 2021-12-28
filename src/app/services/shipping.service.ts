import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '../shipping/shipping.component';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor() { }

  getStores(): Observable<Store[]> {
    return of([
      new Store('id_1', 'store_1'),
      new Store('id_2', 'store_2'),
      new Store('id_3', 'store_3')]);
  }
}
