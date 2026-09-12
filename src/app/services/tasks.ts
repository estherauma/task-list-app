import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  status: string;
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

  isDatePickerOpen: boolean = false;

  private ready(): Promise<Storage> {
    return this.storageReady;
  }

    async addTask(task: Task) {
      await this.ready();
      const tasks: Task[] = await this.storage.get(TASKS_KEY);
      const existing: Task[] = tasks || [];
      task.id = existing.length > 0 ? Math.max(...existing.map(t => t.id)) + 1 : 1;
      existing.push(task);
      await this.storage.set(TASKS_KEY, existing);
      return task;
    }

    async getTasks() {
      await this.ready();
      const tasks = await this.storage.get(TASKS_KEY);
      return tasks || [];
    }

    async updateTask(task: Task){
      await this.ready();
      const tasks: Task[] = await this.storage.get(TASKS_KEY);
      if (!tasks) {
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

    async deleteTask(taskId: number) {
      await this.ready();
      const tasks: Task[] = await this.storage.get(TASKS_KEY);
      if (!tasks) {
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

    openDatePicker() {
     this.isDatePickerOpen = true;
    }

    closeDatePicker() {
     this.isDatePickerOpen = false;
    }

    async getTaskByID(taskId: number) {
      await this.ready();
      const tasks: Task[] = await this.storage.get(TASKS_KEY);
      const task = tasks.find(t => t.id === taskId);
      return task;
    }

    goBack() {
      window.history.back();
    }
  }
