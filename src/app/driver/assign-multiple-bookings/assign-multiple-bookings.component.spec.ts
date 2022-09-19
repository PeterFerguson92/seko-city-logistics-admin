import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMultipleBookingsComponent } from './assign-multiple-bookings.component';

describe('AssignMultipleBookingsComponent', () => {
  let component: AssignMultipleBookingsComponent;
  let fixture: ComponentFixture<AssignMultipleBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignMultipleBookingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignMultipleBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
