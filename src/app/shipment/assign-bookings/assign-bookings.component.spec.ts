import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignBookingsComponent } from './assign-bookings.component';

describe('AssignBookingsComponent', () => {
  let component: AssignBookingsComponent;
  let fixture: ComponentFixture<AssignBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignBookingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
