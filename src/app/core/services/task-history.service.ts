import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskHistory, TaskHistoryFilter } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskHistoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/history`;

  getHistory(filter?: TaskHistoryFilter): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(this.apiUrl, {
      params: filter as any
    });
  }

  getTaskHistory(taskId: string): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(`${this.apiUrl}/task/${taskId}`);
  }

  getRecentHistory(limit: number = 10): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(`${this.apiUrl}/recent`, {
      params: { limit: limit.toString() }
    });
  }
}
