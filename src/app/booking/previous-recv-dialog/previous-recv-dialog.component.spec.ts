import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousRecvDialogComponent } from './previous-recv-dialog.component';

describe('PreviousRecvDialogComponent', () => {
  let component: PreviousRecvDialogComponent;
  let fixture: ComponentFixture<PreviousRecvDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousRecvDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousRecvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
