import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-preview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-preview.component.html',
  styleUrls: ['./about-preview.component.css']
})
export class AboutPreviewComponent {

}
