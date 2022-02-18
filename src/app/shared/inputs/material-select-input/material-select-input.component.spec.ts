import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialSelectInputComponent } from './material-select-input.component';

describe('MaterialSelectInputComponent', () => {
  let component: MaterialSelectInputComponent;
  let fixture: ComponentFixture<MaterialSelectInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialSelectInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
