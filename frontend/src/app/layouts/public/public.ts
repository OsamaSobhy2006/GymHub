import { Component } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public',
  imports: [Navbar, RouterOutlet ],
  templateUrl: './public.html',
  styleUrl: './public.css',
})
export class Public {

}
