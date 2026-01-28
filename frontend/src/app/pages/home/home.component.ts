import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ImageCardComponent } from '../../shared/image-card/image-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, ImageCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected readonly admin = false;

  protected readonly cards = [
    {
      title: 'Aktuelles',
      description: 'Neuigkeiten und wichtige Hinweise aus dem Verein.',
      route: '/',
      imageUrl: 'assets/images/aktuell.jpg'
    },
    {
      title: 'Freie Gaerten',
      description: 'Aktuelle Verfuegbarkeiten und Bewerbungshinweise.',
      route: '/freie-gaerten',
      imageUrl: 'assets/images/freie-gaerten.jpg'
    },
    {
      title: 'Vereinsleben',
      description: 'Termine, Aktionen und Veranstaltungen im Blick.',
      route: '/vereinsleben',
      imageUrl: 'assets/images/vereinsleben.jpg'
    },
    {
      title: 'Vorstand',
      description: 'Ansprechpersonen, Aufgaben und Zustaendigkeiten.',
      route: '/vorstand',
      imageUrl: 'assets/images/vorstand.jpg'
    },
    {
      title: 'Vereinshaus',
      description: 'Informationen rund um Nutzung und Ausstattung.',
      route: '/vereinshaus',
      imageUrl: 'assets/images/vereinshaus.jpg'
    },
    {
      title: 'Aushaenge',
      description: 'Wichtige Mitteilungen und Bekanntmachungen.',
      route: '/aushange',
      imageUrl: 'assets/images/aushang.jpg'
    },
    {
      title: 'Dokumente',
      description: 'Formulare, Satzung und Vereinsunterlagen.',
      route: '/dokumente',
      imageUrl: 'assets/images/dokumente.jpg'
    },
    {
      title: 'Verleih',
      description: 'Geraete und Ausstattung fuer Mitglieder.',
      route: '/verleih',
      imageUrl: 'assets/images/verleih.jpg'
    },
    {
      title: 'Vorstand intern',
      description: 'Interner Bereich mit Schnellzugriffen.',
      route: '/intern',
      imageUrl: 'assets/images/vorstand.jpg',
      badge: 'Intern',
      adminOnly: true
    }
  ];
}
