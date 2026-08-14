import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const TASKS_KEY = 'my-tasks';

@Injectable({
  providedIn: 'root',
})
export class Tasks {

  private storageReady: Promise<void>;

  constructor(private storage: Storage) {
    this.storageReady = this.storage.create().then(() => {});
  }

  private ready(): Promise<void> {
    return this.storageReady;
  }

    addTask(task: Task): Promise<any> {
      return this.ready().then(() => this.storage.get(TASKS_KEY)).then((tasks: Task[]) => {
        const existing: Task[] = tasks || [];
        task.id = existing.length > 0 ? Math.max(...existing.map(t => t.id)) + 1 : 1;
        existing.push(task);
        return this.storage.set(TASKS_KEY, existing);
      });
    }

    getTasks(): Promise<Task[]> {
      return this.ready().then(() => this.storage.get(TASKS_KEY));
    }

    updateTask(task: Task): Promise<any> {
      return this.ready().then(() => this.storage.get(TASKS_KEY)).then((tasks: Task[]) => {
        if (!tasks || tasks.length === 0) {
          return null;
        }
        let newTasks: Task[] = [];
        for (let i of tasks) {
          if (i.id === task.id) {
            newTasks.push(task);
          } else {
            newTasks.push(i);
          }
        }
        return this.storage.set(TASKS_KEY, newTasks);
      });
    }

    deleteTask(taskId: number): Promise<Task>{
      return this.ready().then(() => this.storage.get(TASKS_KEY)).then((tasks: Task[]) => {
        if (!tasks || tasks.length === 0) {
          return null;
        }
        let toKeep: Task[] = [];
        for (let i of tasks) {
          if (i.id !== taskId) {
            toKeep.push(i);
          }
        }
        return this.storage.set(TASKS_KEY, toKeep);
      });
    }


  
}
