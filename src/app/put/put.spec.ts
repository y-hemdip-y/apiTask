import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Put } from './put';

describe('Put', () => {
  let component: Put;
  let fixture: ComponentFixture<Put>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Put]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Put);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
