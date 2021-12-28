import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShippingService } from '../services/shipping.service';

export class Store {
  constructor(public id: string, public name: string) { }
}

export enum DeliveryOptions {
  PickupStore = 'pickup_store',
  HomeDelivery = 'home_delivery'
}

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {

  stores: Store[] = [];

  shippingForm = new FormGroup({
    deliveryOption: new FormControl(null, Validators.required),
    pickupStore: new FormControl(null, []),
    deliveryAddress: new FormControl(null, []),
    shippingCost: new FormControl(null, [Validators.required]),
  });

  constructor(private service: ShippingService) { }

  get deliveryOption(): AbstractControl | null {
    return this.shippingForm.get('deliveryOption');
  }

  get pickupStore(): AbstractControl | null {
    return this.shippingForm.get('pickupStore');
  }

  get deliveryAddress(): AbstractControl | null {
    return this.shippingForm.get('deliveryAddress');
  }

  get shippingCost(): AbstractControl | null {
    return this.shippingForm.get('shippingCost');
  }

  ngOnInit(): void {
    this.service.getStores().subscribe(data => {
      this.stores = data;
    });

    this.shippingForm.get('deliveryOption')?.valueChanges.subscribe(option => {
      if (option === DeliveryOptions.HomeDelivery) {
        this.deliveryAddress?.setValidators([Validators.required]);
        this.pickupStore?.setValidators(null);
        this.pickupStore?.setValue(null);
        this.shippingCost?.setValue(10.99);
      } else {
        this.pickupStore?.setValidators([Validators.required]);
        this.deliveryAddress?.setValidators(null);
        this.deliveryAddress?.setValue(null);
        this.shippingCost?.setValue(0.0);
      }
      
      this.pickupStore?.updateValueAndValidity();
      this.deliveryAddress?.updateValueAndValidity();
    });

    this.deliveryOption?.setValue(DeliveryOptions.PickupStore);
  }

  onSave(): void {
    console.log('The shipping information has been saved ...');
  }

}
