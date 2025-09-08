import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Get } from './get';

describe('Get', () => {
  let component: Get;
  let fixture: ComponentFixture<Get>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Get]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Get);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
