import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModelsProvider } from "../../providers/models/models";
// import { NgModel } from '@angular/forms';
//import * as katex from 'katex';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public models: ModelsProvider) {
  }

  tapCard(ind){
    this.models.active = (ind === this.models.active) ? -1 : ind;
  }

  classCard(ind){
    return (ind === this.models.active) ? "cardBorder" : "";
  }

}
