import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsLocationsComponent } from './bookings-locations.component';

describe('BookingsLocationsComponent', () => {
  let component: BookingsLocationsComponent;
  let fixture: ComponentFixture<BookingsLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingsLocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingsLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
