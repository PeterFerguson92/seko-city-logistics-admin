import { Injectable } from '@angular/core';
import {Resolve,ActivatedRouteSnapshot} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { TaskService } from '../task.service';

@Injectable({
  providedIn: 'root'
})
export class TasksResolver implements Resolve<boolean> {
  constructor(private taskService: TaskService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.taskService.getTasks()
              .pipe(map(data => data.data.tasks));
  }
}
