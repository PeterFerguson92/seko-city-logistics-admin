import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialNumericInputComponent } from './material-numeric-input.component';

describe('MaterialNumericInputComponent', () => {
  let component: MaterialNumericInputComponent;
  let fixture: ComponentFixture<MaterialNumericInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialNumericInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialNumericInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
