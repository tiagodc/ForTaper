import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModelsProvider } from "../../providers/models/models";
import { WebsiteProvider } from '../../providers/website/website'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public models: ModelsProvider, public web: WebsiteProvider) {
  }

  tapCard(ind){
    this.models.active = (ind === this.models.active) ? -1 : ind;
  }

  classCard(ind){
    return (ind === this.models.active) ? "cardBorder" : "";
  }

}
