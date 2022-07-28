import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverBookingsComponent } from './driver-bookings.component';

describe('DriverBookingsComponent', () => {
  let component: DriverBookingsComponent;
  let fixture: ComponentFixture<DriverBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverBookingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
