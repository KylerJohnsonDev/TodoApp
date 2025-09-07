import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast, ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, Toast],
  template: `<router-outlet /> <p-toast />`,
  styleUrl: './app.css',
  providers: [],
})
export class App {}
