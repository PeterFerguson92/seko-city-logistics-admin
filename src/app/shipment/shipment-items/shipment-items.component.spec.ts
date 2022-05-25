import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentItemsComponent } from './shipment-items.component';

describe('ShipmentItemsComponent', () => {
  let component: ShipmentItemsComponent;
  let fixture: ComponentFixture<ShipmentItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
