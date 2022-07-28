import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverBookingsLocationsComponent } from './driver-bookings-locations.component';

describe('DriverBookingsLocationsComponent', () => {
  let component: DriverBookingsLocationsComponent;
  let fixture: ComponentFixture<DriverBookingsLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverBookingsLocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverBookingsLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
