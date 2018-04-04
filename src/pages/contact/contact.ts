import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { ModelsProvider } from "../../providers/models/models";
import * as Plotly from '../../assets/plotly-latest.min.js'

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, public models: ModelsProvider, public loadingCtrl: LoadingController) {}

  presentLoadingDefault() {
	let loading = this.loadingCtrl.create({
	  content: 'Please wait...'
	});
  
	loading.present();
  
	setTimeout(() => {
	  loading.dismiss();
	}, 5000);
  };

  storePlot;

  ionViewWillEnter(){

			if(this.models.active === -1) return;

			// this.presentLoadingDefault();

			let data;
			data = this.models.modelsList[ this.models.active ];
			data = data.function();
			
			let x2d = data.map(xy => xy.x);
			let y2d = data.map(xy => xy.y);

			let x3d = [];
			let y3d = [];
			let z3d = [];
			for(let i = 0; i < x2d.length; ++i){
				let z = y2d[i];

				for(let j = 0; j < 360; j += 20){
					let y = x2d[i] * Math.sin( j * Math.PI / 180 );
					let x = x2d[i] * Math.cos( j * Math.PI / 180 );

					x3d.push(x);
					y3d.push(y);
					z3d.push(z);
				}
			}

			let cloud = {
				x: x3d,
				y: y3d,
				z: z3d,
				opacity:1,
      	color:'rgb(50,300,50)',
     	  type: 'mesh3d'
			}

			var layout = {
				scene:{
					aspectmode: "manual",
					aspectratio: { x: 1, y: 1, z: 1},
					xaxis: {range: [-120, 120], autorange: false},
					yaxis: {range: [-120, 120], autorange: false},
					zaxis: {autorange: true }
				},
				margin: { l: 0, r: 0, b: 0, t: 0 }
			};
			
			if(this.storePlot){
				Plotly.redraw('myDiv');
			}else{
				this.storePlot = Plotly.newPlot('myDiv', [cloud], layout);
				// console.log(this.storePlot);
			}
		
    /*Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/3d-scatter.csv', function(err, rows){
function unpack(rows, key) {
	return rows.map(function(row)
	{ return row[key]; });}

var trace1 = {
	x:unpack(rows, 'x1'), y: unpack(rows, 'y1'), z: unpack(rows, 'z1'),
	mode: 'markers',
	marker: {
		size: 12,
		line: {
		color: 'rgba(217, 217, 217, 0.14)',
		width: 0.5},
		opacity: 0.8},
	type: 'scatter3d'
};

var trace2 = {
	x:unpack(rows, 'x2'), y: unpack(rows, 'y2'), z: unpack(rows, 'z2'),
	mode: 'markers',
	marker: {
		color: 'rgb(127, 127, 127)',
		size: 12,
		symbol: 'circle',
		line: {
		color: 'rgb(204, 204, 204)',
		width: 1},
		opacity: 0.8},
	type: 'scatter3d'};

var data = [trace1, trace2];
var layout = {margin: {
	l: 0,
	r: 0,
	b: 0,
	t: 0
  }};
Plotly.newPlot('myDiv', data, layout);
});*/
  }

}
