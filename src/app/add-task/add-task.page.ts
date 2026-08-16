import { Component, OnInit } from '@angular/core';
import { Task, Tasks } from '../services/tasks';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: false
})
export class AddTaskPage implements OnInit {

  tasks: Task[] = [];
  newTask: Task = <Task>{};


  constructor(private tasksService: Tasks, private toastController: ToastController) { }

  ngOnInit() {
  }
  addTask() {
    if (!this.newTask.title || !this.newTask.description) {
      this.showToast('Please enter a title and description for the task.');
      return;
    }

    this.tasksService.addTask(this.newTask).then(() => {
      this.newTask = <Task>{};
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
      this.showToast('Task updated successfully.');
    });
  }

  deleteTask(taskId: number) {
    this.tasksService.deleteTask(taskId).then(() => {
      this.showToast('Task deleted successfully.');
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
