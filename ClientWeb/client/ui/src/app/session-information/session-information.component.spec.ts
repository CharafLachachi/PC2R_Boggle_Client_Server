import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionInformationComponent } from './session-information.component';

describe('SessionInformationComponent', () => {
  let component: SessionInformationComponent;
  let fixture: ComponentFixture<SessionInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
