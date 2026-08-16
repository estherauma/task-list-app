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

  private storageReady: Promise<Storage>;

  constructor(private storage: Storage) {
    this.storageReady = this.storage.create();
  }

  private ready(): Promise<Storage> {
    return this.storageReady;
  }

    async addTask(task: Task): Promise<Task> {
      await this.ready();
      const tasks: Task[] = await this.storage.get(TASKS_KEY);
      const existing: Task[] = tasks || [];
      task.id = existing.length > 0 ? Math.max(...existing.map(t => t.id)) + 1 : 1;
      existing.push(task);
      await this.storage.set(TASKS_KEY, existing);
      return task;
    }

    async getTasks(): Promise<Task[]> {
      await this.ready();
      const tasks = await this.storage.get(TASKS_KEY);
      return tasks || [];
    }

    async updateTask(task: Task): Promise<any> {
      await this.ready();
      const tasks: Task[] = await this.storage.get(TASKS_KEY);
      if (!tasks || tasks.length === 0) {
        return null;
      }
      const newTasks: Task[] = [];
      for (let i of tasks) {
        if (i.id === task.id) {
          newTasks.push(task);
        } else {
          newTasks.push(i);
        }
      }
      return this.storage.set(TASKS_KEY, newTasks);
    }

    async deleteTask(taskId: number): Promise<void>{
      await this.ready();
      const tasks: Task[] = await this.storage.get(TASKS_KEY);
      if (!tasks || tasks.length === 0) {
        return;
      }
      const toKeep: Task[] = [];
      for (let i of tasks) {
        if (i.id !== taskId) {
          toKeep.push(i);
        }
      }
      return this.storage.set(TASKS_KEY, toKeep);
    }
}
