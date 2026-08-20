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

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const task = await this.tasksService.getTaskByID(id);
    if (task) {
      this.task = task;
    } else {
      this.showToast('Task not found.', 'danger');
      this.tasksService.goBack();
    }
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
    if (!this.editingTask.status) {
      this.showToast('Status is required.','danger');
      return;
    }
    this.tasksService.updateTask(this.editingTask).then(() => {
      this.task = this.editingTask!;
      this.showToast('Task updated successfully.', 'success');
      this.cancelEdit();
    });
  }

  async showToast(message: string,color: string ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: color
    });
    toast.present();
  }

  deleteTask(taskId: number) {
    this.tasksService.deleteTask(taskId).then(() => {
      this.showToast('Task deleted successfully.', 'success');
      this.goBack();
    });
  }

}
