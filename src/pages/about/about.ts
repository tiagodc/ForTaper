import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModelsProvider } from "../../providers/models/models";
import * as Plotly from '../../assets/plotly-latest.min.js'
import * as katex from 'katex';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public models: ModelsProvider) {
  }

  greekVars = {
    kappa: katex.renderToString('\\kappa'),
    lambda: katex.renderToString('\\lambda')
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
    margin: { l: 50, r: 0, t: 25, b: 25 }
  };

  chartData = [this.trace1, this.trace2];
  storePlot;
  redistribute(){
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
    this.redistribute();
  }
}
