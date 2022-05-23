import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingUpdateDialogComponent } from './booking-update-dialog.component';

describe('BookingUpdateDialogComponent', () => {
  let component: BookingUpdateDialogComponent;
  let fixture: ComponentFixture<BookingUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
