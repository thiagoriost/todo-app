export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
  createdAt: Date;
  taskCount?: number;
}

export interface CreateCategoryDto {
  name: string;
  color: string;
  icon?: string;
  description?: string;
}
