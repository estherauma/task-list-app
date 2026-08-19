import { Component } from '@angular/core';
import { Task, Tasks } from '../../services/tasks';
import { ToastController,AlertController } from '@ionic/angular';

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
    private toastController: ToastController,
    private alertController: AlertController) {
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

  toggleComplete(task: Task, event: any) {
    task.status = event.detail.value;
    this.tasksService.updateTask(task).then(() => {
      this.loadTasks();
    });
  }

  deleteTask(task: Task) {
    const alert = this.alertController.create({
      header: 'Confirm Delete',
      subHeader: `Are you sure you want to delete "${task.title}"?`,
      message: `This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          cssClass: 'alert-button-delete',
          handler: () => {
            this.tasksService.deleteTask(task.id).then(() => {
              this.showToast('Task deleted successfully.','success');
              this.loadTasks();
            });
          }
        }
      ]
    });
    alert.then(alertEl => alertEl.present());
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
