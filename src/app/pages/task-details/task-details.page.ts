import { Component, OnInit } from '@angular/core';
import { Tasks, Task } from '../../services/tasks';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
  standalone: false
})
export class TaskDetailsPage implements OnInit {
  task: Task = <Task>{};
  editingTask: Task | null = null;
  showEditModal = false;
  constructor(public tasksService: Tasks, private route: ActivatedRoute, private toastController: ToastController) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tasksService.getTaskByID(id).then((task: Task | null) => {
      if (task) {
        this.task = task;
      }
    });
  }

  goBack() {
    this.tasksService.goBack();
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
    if (!this.editingTask) return;
    if (!this.editingTask.title || !this.editingTask.description) {
      this.showToast('Title and description are required.');
      return;
    }
    this.tasksService.updateTask(this.editingTask).then(() => {
      this.task = this.editingTask!;
      this.showToast('Task updated successfully.');
      this.cancelEdit();
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  deleteTask(taskId: number) {
    this.tasksService.deleteTask(taskId).then(() => {
      this.showToast('Task deleted successfully.');
      this.goBack();
    });
  }

}
