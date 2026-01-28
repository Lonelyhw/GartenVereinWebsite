import { Component } from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'app-dokumente',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './dokumente.component.html',
  styleUrl: './dokumente.component.scss'
})
export class DokumenteComponent {}
