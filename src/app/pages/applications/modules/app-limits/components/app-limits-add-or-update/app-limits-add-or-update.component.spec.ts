/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppLimitsAddOrUpdateComponent } from './app-limits-add-or-update.component';

describe('AppLimitsAddOrUpdateComponent', () => {
  let component: AppLimitsAddOrUpdateComponent;
  let fixture: ComponentFixture<AppLimitsAddOrUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLimitsAddOrUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLimitsAddOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
