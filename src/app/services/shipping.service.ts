import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '../shipping/shipping.component';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor(private httpClient: HttpClient) { }

  getStores(): Observable<Store[]> {
    return this.httpClient.get<Store[]>('/api/v1/fake-endpoint/stores');
  }

  saveDeliveryInfo(shippingInfo: any): Observable<void> {
    return of();
  }
}
