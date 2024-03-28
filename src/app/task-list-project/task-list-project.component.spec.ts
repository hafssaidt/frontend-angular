import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListProjectComponent } from './task-list-project.component';

describe('TaskListProjectComponent', () => {
  let component: TaskListProjectComponent;
  let fixture: ComponentFixture<TaskListProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListProjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
