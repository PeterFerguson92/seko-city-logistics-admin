import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTextAreaInputComponent } from './material-text-area-input.component';

describe('MaterialTextAreaInputComponent', () => {
  let component: MaterialTextAreaInputComponent;
  let fixture: ComponentFixture<MaterialTextAreaInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTextAreaInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTextAreaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
