import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule]

})


export class AppComponent implements OnInit {
  ngOnInit() {
    window.screen.orientation.lock('portrait');
    firebase.initializeApp(environment.firebaseConfig);
  }
}
