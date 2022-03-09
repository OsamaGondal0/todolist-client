import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarFilterComponent } from './navbar-filter.component';

describe('NavbarFilterComponent', () => {
  let component: NavbarFilterComponent;
  let fixture: ComponentFixture<NavbarFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
