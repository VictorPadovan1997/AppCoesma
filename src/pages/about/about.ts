import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';



@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingProvider) {
setTimeout(() => { 
       setTimeout(() => { 
       this.loadingCtrl.dismiss().then(() => {
       this.loadingCtrl.presentWithMessage('Carregando');  
          setTimeout(() => { 
       this.loadingCtrl.dismiss().then(() => {}); 
    }, 5000);								
 }); 
    }, 5000);
       });		 					       
}  
}