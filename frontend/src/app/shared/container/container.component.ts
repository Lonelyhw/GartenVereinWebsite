import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [NgClass],
  templateUrl: './container.component.html'
})
export class ContainerComponent {
  @Input() className = '';
}