import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPlusButtonComponent } from './material-plus-button.component';

describe('MaterialPlusButtonComponent', () => {
  let component: MaterialPlusButtonComponent;
  let fixture: ComponentFixture<MaterialPlusButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialPlusButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialPlusButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
