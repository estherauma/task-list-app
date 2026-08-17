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


  constructor(public tasksService: Tasks, private toastController: ToastController) { }

  ngOnInit() {
  }
  addTask() {
    if (!this.newTask.title || !this.newTask.description) {
      this.showToast('Please enter a title and description for the task.', 'danger');
      return;
    }

    this.tasksService.addTask(this.newTask).then(() => {
      this.newTask = <Task>{};
      this.showToast('Task added successfully.', 'success');
    });
  }

  loadTasks() {
    this.tasksService.getTasks().then((tasks: Task[]) => {
      this.tasks = tasks || [];
    });
  }

  updateTask(task: Task) {
    this.tasksService.updateTask(task).then(() => {
      this.showToast('Task updated successfully.', 'success');
    });
  }

  deleteTask(taskId: number) {
    this.tasksService.deleteTask(taskId).then(() => {
      this.showToast('Task deleted successfully.', 'success');
    });
  }

  async showToast(message: string, color: string ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  openDatePicker() {
    this.tasksService.openDatePicker();
  }

  closeDatePicker() {
    this.tasksService.closeDatePicker();
  }

  goBack() {
    this.tasksService.goBack();
  }
}
