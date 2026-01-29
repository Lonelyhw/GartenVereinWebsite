import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VereinshausComponent } from './pages/vereinshaus/vereinshaus.component';
import { FreieGaertenComponent } from './pages/freie-gaerten/freie-gaerten.component';
import { VorstandComponent } from './pages/vorstand/vorstand.component';
import { AushangeComponent } from './pages/aushange/aushange.component';
import { DokumenteComponent } from './pages/dokumente/dokumente.component';
import { VerleihComponent } from './pages/verleih/verleih.component';
import { VereinslebenComponent } from './pages/vereinsleben/vereinsleben.component';
import { InternComponent } from './pages/intern/intern.component';
import { NewsDetailComponent } from './pages/news-detail/news-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'vereinshaus', component: VereinshausComponent },
  { path: 'freie-gaerten', component: FreieGaertenComponent },
  { path: 'vorstand', component: VorstandComponent },
  { path: 'aushange', component: AushangeComponent },
  { path: 'dokumente', component: DokumenteComponent },
  { path: 'verleih', component: VerleihComponent },
  { path: 'vereinsleben', component: VereinslebenComponent },
  { path: 'intern', component: InternComponent },
  { path: 'news/:id', component: NewsDetailComponent },
];
