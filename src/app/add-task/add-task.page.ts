import { Component, OnInit } from '@angular/core';
import { Task, Tasks } from '../services/tasks';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { IonList } from '@ionic/angular';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: false
})
export class AddTaskPage implements OnInit {

  tasks: Task[] = [];
  newTask: Task = <Task>{};

  @ViewChild('taskList') taskList!: IonList;

  constructor(private tasksService: Tasks, private toastController: ToastController, private platform: Platform) { 
    this.platform.ready().then(() => {
      this.loadTasks();
    });
  }

  ngOnInit() {
  }
  addTask() {
    if (!this.newTask.title || !this.newTask.description) {
      this.showToast('Please enter a title and description for the task.');
      return;
    }

    this.tasksService.addTask(this.newTask).then(() => {
      this.newTask = <Task>{};
      this.loadTasks();
      this.showToast('Task added successfully.');
    });
  }

  loadTasks() {
    this.tasksService.getTasks().then((tasks: Task[]) => {
      this.tasks = tasks || [];
    });
  }

  updateTask(task: Task) {
    this.tasksService.updateTask(task).then(() => {
      this.loadTasks();
      this.showToast('Task updated successfully.');
    });
  }

  deleteTask(taskId: number) {
    this.tasksService.deleteTask(taskId).then(() => {
      this.showToast('Task deleted successfully.');
      this.taskList.closeSlidingItems();
      this.loadTasks();
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
