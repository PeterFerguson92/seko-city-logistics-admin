import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRadioButtonComponent } from './material-radio-button.component';

describe('MaterialRadioButtonComponent', () => {
  let component: MaterialRadioButtonComponent;
  let fixture: ComponentFixture<MaterialRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialRadioButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
