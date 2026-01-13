import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category, CreateCategoryDto } from '../../core/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  loading = signal(true);
  showForm = signal(false);

  categoryForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    color: ['#2196f3', Validators.required],
    icon: ['📁'],
    description: ['']
  });

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading.set(false);
      }
    });
  }

  toggleForm() {
    this.showForm.update(value => !value);
    if (!this.showForm()) {
      this.categoryForm.reset({ color: '#2196f3', icon: '📁' });
    }
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const categoryData: CreateCategoryDto = this.categoryForm.value;

      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.toggleForm();
        },
        error: (error) => console.error('Error creating category:', error)
      });
    }
  }

  editCategory(category: Category) {
    // TODO: Implement edit
    console.log('Edit category:', category);
  }

  deleteCategory(id: string) {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Error deleting category:', error)
      });
    }
  }
}
