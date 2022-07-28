import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverBookingsNotFoundComponent } from './driver-bookings-not-found.component';

describe('DriverBookingsNotFoundComponent', () => {
  let component: DriverBookingsNotFoundComponent;
  let fixture: ComponentFixture<DriverBookingsNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverBookingsNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverBookingsNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
