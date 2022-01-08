import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ShippingService } from '../services/shipping.service';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatRadioButtonHarness } from '@angular/material/radio/testing';
import { ShippingComponent } from './shipping.component';
import { MatInputHarness } from '@angular/material/input/testing';

const STORES = [
  { id: 'id-1', name: 'nearest-store' },
  { id: 'id-2', name: 'farthest-store' }
];

describe('ShippingComponent', () => {
  let component: ShippingComponent;
  let fixture: ComponentFixture<ShippingComponent>;
  let loader: HarnessLoader;
  let shippingServiceSpy: jasmine.SpyObj<ShippingService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShippingComponent],
      imports: [
        // Include all modules required for the component's template to render.
        HttpClientModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatRadioModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        NoopAnimationsModule
      ],
      providers: [
        // Spy the shipping service so that we control the reponses it provides
        { provide: ShippingService, useValue: jasmine.createSpyObj('ShippingService', ['getStores', 'saveDeliveryInfo']) }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    // Stub the response provided by the shipping service
    shippingServiceSpy = TestBed.inject(ShippingService) as jasmine.SpyObj<ShippingService>;
    shippingServiceSpy.getStores.and.returnValue(of(STORES));
    shippingServiceSpy.saveDeliveryInfo.and.returnValue(of());

    // Instantiate the component under testing
    fixture = TestBed.createComponent(ShippingComponent);
    component = fixture.componentInstance;

    // Trigger change detection (data binding)
    fixture.detectChanges();

    // Set the loader to get access to Angular Material template elements.
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should spy ShippingService', () => {
    expect(shippingServiceSpy).toBeTruthy();
    shippingServiceSpy.getStores().subscribe(data => {
      expect(data).toEqual(STORES);
    });
  });

  describe('pick up purchase at store', () => {
    it('should work ok', async () => {
      // Find the 'pick up at store' radio button and check it.
      const pickupStoreRadioBtn = (await loader.getAllHarnesses(MatRadioButtonHarness))[0];
      await pickupStoreRadioBtn.check();

      // Open on the mat-select element and click on the first option.
      const storeSelect = await loader.getHarness(MatSelectHarness);
      await storeSelect.open();
      const firstSelectOption = (await storeSelect.getOptions())[0];
      await firstSelectOption.click();

      // Click on the save button
      const saveBtn = await loader.getHarness(MatButtonHarness);
      await saveBtn.click();

      // Verify that the service is called to save the data
      expect(shippingServiceSpy.saveDeliveryInfo).toHaveBeenCalledWith(
        { deliveryOption: 'pickup_store', pickupStore: 'id-1', deliveryAddress: null, shippingCost: 0 }
      );
    });

    it('should validate the store as required', async () => {
      // Find the 'pick up at store' radio button and check it.
      const pickupStoreRadioBtn = (await loader.getAllHarnesses(MatRadioButtonHarness))[0];
      await pickupStoreRadioBtn.check();

      // Open on the mat-select element but do not select any option to trigger the validation.
      const storeSelect = await loader.getHarness(MatSelectHarness);
      await storeSelect.open();
      await storeSelect.close();

      // Verify the mat-error is displayed.
      const formField = await loader.getHarness(MatFormFieldHarness);
      const errors = await formField.getTextErrors();
      expect(errors).toEqual(['The pickup store is required.']);

      // Verify that mat-button is disabled.
      const saveBtn = await loader.getHarness(MatButtonHarness);
      expect(await saveBtn.isDisabled()).toBeTrue();
    });
  });

  describe('home delivery', () => {
    it('should work ok', async () => {
      // Find the 'home delivery' radio button and check it.
      const homeDeliveryRadioBtn = (await loader.getAllHarnesses(MatRadioButtonHarness))[1];
      await homeDeliveryRadioBtn.check();

      // Set the delivery address.
      const homeAddress = await loader.getHarness(MatInputHarness);
      await homeAddress.setValue('Street a, place b, 10897 Somewhere');

      // Click on the save button
      const saveBtn = await loader.getHarness(MatButtonHarness);
      await saveBtn.click();

      // Verify that the service is called to save the data
      expect(shippingServiceSpy.saveDeliveryInfo).toHaveBeenCalledWith(
        { deliveryOption: 'home_delivery', pickupStore: null, deliveryAddress: 'Street a, place b, 10897 Somewhere', shippingCost: 10.99 }
      );
    });

    it('should validate the home address as required', async () => {
      // Find the 'home delivery' radio button and check it.
      const homeDeliveryRadioBtn = (await loader.getAllHarnesses(MatRadioButtonHarness))[1];
      await homeDeliveryRadioBtn.check();

      // Set focus on the mat-input but do not set any value to trigger the validation.
      const homeAddress = await loader.getHarness(MatInputHarness);
      await homeAddress.focus();

      // Set the focus on another element so that 'Home Address' shows the mat-error.
      await homeDeliveryRadioBtn.focus();

      // Verify the mat-error is displayed.
      const formField = await loader.getHarness(MatFormFieldHarness);
      const errors = await formField.getTextErrors();
      expect(errors).toEqual(['The delivery address is required.']);

      // Verify that mat-button is disabled.
      const saveBtn = await loader.getHarness(MatButtonHarness);
      expect(await saveBtn.isDisabled()).toBeTrue();
    });
  });
});
