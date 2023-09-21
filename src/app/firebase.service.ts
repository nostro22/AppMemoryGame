import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage'
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage'
import 'firebase/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private router: Router,private toastCtrl: ToastController, private loadingCtrl: LoadingController) { 
    this.dificultad=1;
  }
  private user: any;
  public usuarioAutenticado: any;
  public dificultad:number;

  async login(email: string, password: string, dificulta:number) {
    try {
      const validado = await firebase.auth().signInWithEmailAndPassword(email,password );
       this.showLoading('Ingresando');

      if (validado) {
        // Validation successful
        this.dificultad = dificulta;
        this.usuarioAutenticado=firebase.auth().currentUser;
        this.router.navigateByUrl('home', { replaceUrl: true });
      } else {
        // Validation failed
        this.toastNotification('Llene ambos campos correo electrónico y clave');
      }
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
          this.toastNotification('El usuario no se encuentra registrado.');
          break;
        case 'auth/wrong-password':
          this.toastNotification('Combinación de clave y correo electrónico errónea.');
          break;
        default:
          this.toastNotification('Ocurrió un error durante el inicio de sesión.');
          break;
      }
    }
  }
  async showLoading(mensaje:string) {
    const loading = await this.loadingCtrl.create({
      message: mensaje,
      translucent:true,
      duration:6000,
      cssClass: 'custom-loading',
      showBackdrop: false,
      backdropDismiss:false,
    });
    loading.present();
    return new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));
  }
  async toastNotification(mensaje: any) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'middle',
      icon: 'alert-outline',
      color: 'danger'
    });
    (await toast).present();
  }

  async getUser() {
    return firebase.auth().currentUser
  }


  logout() {
    firebase.auth().signOut().then(() => {
      this.router.navigate(['log']);
    });
  }
  async uploadScore(tiempo: string, usuarioMail: string) {
    try {
      const user = this.usuarioAutenticado;
      if (!user) {
        throw new Error("Usuario no ingreso");
      }

      const photoRefCollection = firebase.firestore().collection('tiempos');
      let nombreobtenido = (usuarioMail.split("@"))[0];
      const score = {
        nombre: nombreobtenido,
        usuario: usuarioMail,
        tiempo: tiempo,
      };

      await photoRefCollection.add(score);
    }
    
    catch (error) {
      console.log("Error subiendo el puntaje ", error);
      throw error;
    }
  }

 
 
  async setDificultad(dificultad: number) {
    this.dificultad=dificultad;
  }
  async  getLowestTiempos(): Promise<any[]> {
    const photoRefCollection = firebase.firestore().collection('tiempos');
    const querySnapshot = await photoRefCollection.orderBy('tiempo').limit(5).get();
    const tiemposRef: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tiemposRef.push(data);
    });
    return tiemposRef;
  }
  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }
}
