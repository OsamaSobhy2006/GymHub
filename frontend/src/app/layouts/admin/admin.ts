import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [Sidebar, RouterOutlet],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {}
