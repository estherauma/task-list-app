import { Component } from '@angular/core';
import { Task, Tasks } from '../../services/tasks';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false
})
export class TasksPage {

  tasks: Task[] = [];
  newTask: Task = <Task>{};
  editingTask: Task | null = null;
  showEditModal = false;

  constructor(
    private tasksService: Tasks, 
    private toastController: ToastController) {
  }

  ionViewWillEnter() {
    this.loadTasks();
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
      this.showToast('Title is required.', 'danger');
      return;
    }
    if (!this.editingTask.description) {
      this.showToast('Description is required.','danger');
      return;
    }
    this.tasksService.updateTask(this.editingTask).then(() => {
      this.loadTasks();
      this.showToast('Task updated successfully.', 'success');
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
      this.showToast('Task deleted successfully.','success');
      this.loadTasks();
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: color
    });
    toast.present();
  }
}
