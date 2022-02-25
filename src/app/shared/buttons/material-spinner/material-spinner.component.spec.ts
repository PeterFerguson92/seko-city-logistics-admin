import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialSpinnerComponent } from './material-spinner.component';

describe('MaterialSpinnerComponent', () => {
  let component: MaterialSpinnerComponent;
  let fixture: ComponentFixture<MaterialSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
