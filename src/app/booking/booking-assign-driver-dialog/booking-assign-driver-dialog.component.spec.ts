import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAssignDriverDialogComponent } from './booking-assign-driver-dialog.component';

describe('BookingAssignDriverDialogComponent', () => {
  let component: BookingAssignDriverDialogComponent;
  let fixture: ComponentFixture<BookingAssignDriverDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingAssignDriverDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAssignDriverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
