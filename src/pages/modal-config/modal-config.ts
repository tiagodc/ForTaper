import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { ModelsProvider } from "../../providers/models/models";
import * as katex from 'katex';
import * as _ from 'underscore';

@Component({
  templateUrl: 'modal-config.html'
})
export class ModalConfigPage {

  x: number;
  y: number;
  fail: number;
  isSingle: boolean;
  diams: Array<{d}>;
  
  getDims(){
    this.x =  this.models.plantio.spx;
    this.y =  this.models.plantio.spy;
    this.fail = this.models.plantio.falha * 100;
    this.diams = this.models.plantio.dClasses.map(x => {
      let obj = {'d': x};
      return obj;
    });    
    this.isSingle = this.models.plantio.singleTree;
  }

  setDims(){
    let newX = Number(this.x);
    let newY = Number(this.y);
    let newFail = Number(this.fail / 100);
    let newDiams = this.diams.map(x => Number(x.d));
    let newBool = this.isSingle;
    
    let plantioCopy = Object.assign({}, this.models.plantio);

    plantioCopy.spx = newX;
    plantioCopy.spy = newY;
    plantioCopy.falha = newFail;
    plantioCopy.dClasses = newDiams;
    plantioCopy.singleTree = newBool;   

    let compare = _.isEqual(this.models.plantio, plantioCopy);

    if(!compare){
      this.models.plantioChanged = true;

      this.models.plantio.spx = newX;
      this.models.plantio.spy = newY;
      this.models.plantio.falha = newFail;
      this.models.plantio.dClasses = newDiams;
      this.models.plantio.singleTree = newBool;
    }
  }

  constructor(public viewCtrl: ViewController, params: NavParams, public models: ModelsProvider) {
    this.getDims();
  }

  renderMath(letter, number){
    return katex.renderToString(letter + '_' + number);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewWillLeave(){
    this.setDims();
  }

  ionViewDidEnter(){
    // console.log(this.models.plantio);
  }
}