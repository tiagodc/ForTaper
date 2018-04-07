import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModelsProvider } from "../../providers/models/models";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { WebsiteProvider } from '../../providers/website/website'


import * as Plotly from '../../assets/plotly-latest.min.js'
import * as katex from 'katex';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  title;
  constructor(public navCtrl: NavController, public models: ModelsProvider, private screenOrientation: ScreenOrientation, public web: WebsiteProvider) {
    
    this.screenOrientation.onChange().subscribe( () => {
      let pos = /landscape/i.test(this.screenOrientation.type);
      if(pos){
        this.rotated = true;
      }else{
        this.rotated = false;
      }
      setTimeout( () =>{ this.redistribute(); Plotly.Plots.resize('myChart')}, 200)
    });

    this.rotated = /landscape/i.test(this.screenOrientation.type);
  }

  rotated: boolean;

  greekVars = {
    kappa: katex.renderToString('\\kappa \\space (forma)'),
    lambda: katex.renderToString('\\lambda \\space (escala)')
  }

  trace1 = {
    x: [],
    y: [],
    type: 'scatter',
    fill: 'tozeroy',
    mode: 'lines+markers',
    line:{
        width: 3,
        color: 'green'
    },
    name: 'DAP (cm)'
  };

  trace2 = {
    x: [],
    y: [],
    type: 'scatter',
    fill: 'tozeroy',
    name: 'Ht (m)',
    mode: 'lines+markers',
    line:{
        width: 3,
        color: 'orange'
    }
  }; 

  layout = {
    showlegend: true,
    legend: {
      orientation: "h",
      x: 0.2
    },
    yaxis: {
      title: 'Densidade de probabilidade'
    },
    margin: { l: 50, r: 0, t: 25, b: 15 }
  };

  chartData = [this.trace1, this.trace2];
  storePlot;

  intPars = {
    dwL: 0,
    dwK: 0,
    hwL: 0,
    hwK: 0,
    factor: 10,
    maxD: {K: 0, L: 0},
    maxH: {K: 0, L: 0}
  }
  getPars(){
    let factor = this.intPars.factor;

    this.intPars.dwL = this.models.dwL * factor;
    this.intPars.dwK = this.models.dwK * factor;
    this.intPars.hwL = this.models.hwL * factor;
    this.intPars.hwK = this.models.hwK * factor;

    this.intPars.maxD.K = this.models.maxD.K * factor;
    this.intPars.maxD.L = this.models.maxD.L * factor;
    this.intPars.maxH.K = this.models.maxH.K * factor;
    this.intPars.maxH.L = this.models.maxH.L * factor;
  }

  setPars(){
    let factor = this.intPars.factor;
    
    this.models.dwL = this.intPars.dwL / factor;
    this.models.dwK = this.intPars.dwK / factor;
    this.models.hwL = this.intPars.hwL / factor;
    this.models.hwK = this.intPars.hwK / factor;
  }

  redistribute(){
    this.setPars();
    this.models.fillSorted();

    this.chartData[0].x = this.models.dRange.map(res => res.qtl);
    this.chartData[0].y = this.models.dRange.map(res => res.den);

    this.chartData[1].x = this.models.hRange.map(res => res.qtl);
    this.chartData[1].y = this.models.hRange.map(res => res.den);

    if(!this.storePlot) 
      this.storePlot = Plotly.newPlot('myChart', this.chartData, this.layout);
      
    Plotly.redraw('myChart');
  }
 
  ionViewWillEnter() {
    this.getPars();
    this.redistribute();
    Plotly.Plots.resize('myChart');
  }
}
