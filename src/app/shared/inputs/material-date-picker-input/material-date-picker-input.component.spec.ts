import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDatePickerInputComponent } from './material-date-picker-input.component';

describe('MaterialDatePickerInputComponent', () => {
  let component: MaterialDatePickerInputComponent;
  let fixture: ComponentFixture<MaterialDatePickerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialDatePickerInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDatePickerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
