import { Component, OnInit } from '@angular/core';
import { Task, Tasks } from '../../services/tasks';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false
})
export class TasksPage implements OnInit {

  tasks: Task[] = [];
  newTask: Task = <Task>{};
  editingTask: Task | null = null;
  showEditModal = false;

  constructor(
    private tasksService: Tasks, 
    private toastController: ToastController) {
  }

  ngOnInit() {
    this.loadTasks();
  }

  addTask() {
    if (!this.newTask.title) {
      this.showToast('Title is required.');
      return;
    }
    if (!this.newTask.description) {
      this.showToast('Description is required.');
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

  openEditForm(task: Task) {
    this.editingTask = { ...task };
    this.showEditModal = true;
  }

  cancelEdit() {
    this.editingTask = null;
    this.showEditModal = false;
  }

  saveEdit() {
    if (!this.editingTask) {
      return;
    }
    if (!this.editingTask.title) {
      this.showToast('Title is required.');
      return;
    }
    if (!this.editingTask.description) {
      this.showToast('Description is required.');
      return;
    }
    this.tasksService.updateTask(this.editingTask).then(() => {
      this.loadTasks();
      this.showToast('Task updated successfully.');
      this.cancelEdit();
    });
  }

  toggleComplete(task: Task) {
    task.completed = !task.completed;
    this.tasksService.updateTask(task).then(() => {
      this.loadTasks();
    });
  }

  deleteTask(taskId: number) {
    this.tasksService.deleteTask(taskId).then(() => {
      this.showToast('Task deleted successfully.');
      this.loadTasks();
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}
