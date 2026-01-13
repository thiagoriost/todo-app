import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { Category, TaskPriority, CreateTaskDto } from '../../core/models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  submitting = signal(false);

  taskForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    categoryId: ['', Validators.required],
    priority: ['medium', Validators.required],
    dueDate: [''],
    tagsInput: ['']
  });

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.submitting.set(true);

      const formValue = this.taskForm.value;
      const tags = formValue.tagsInput
        ? formValue.tagsInput.split(',').map((tag: string) => tag.trim())
        : [];

      const taskData: CreateTaskDto = {
        title: formValue.title,
        description: formValue.description || undefined,
        categoryId: formValue.categoryId,
        priority: formValue.priority as TaskPriority,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
        tags: tags.length > 0 ? tags : undefined
      };

      this.taskService.createTask(taskData).subscribe({
        next: (task) => {
          console.log('Task created:', task);
          this.taskForm.reset({ priority: 'medium' });
          this.submitting.set(false);
          // TODO: Navigate to task list or show success message
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.submitting.set(false);
        }
      });
    }
  }

  onCancel() {
    this.taskForm.reset({ priority: 'medium' });
    // TODO: Navigate back
  }
}
