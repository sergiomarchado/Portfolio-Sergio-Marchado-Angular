import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceComponent } from '../../components/experience/experience.component';
import { EducationTimelineComponent } from '../../components/education-timeline/education-timeline.component';

@Component({
  selector: 'app-carrer',
  imports: [CommonModule, ExperienceComponent, EducationTimelineComponent],
  templateUrl: './carrer.component.html',
  styleUrl: './carrer.component.css'
})
export class CarrerComponent {

}
