import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { ModelsProvider } from "../../providers/models/models";
import * as Plotly from '../../assets/plotly-latest.min.js';
import {jStat} from 'jStat';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, public models: ModelsProvider, public loadingCtrl: LoadingController) {}

	load = this.loadingCtrl.create();

	plotData = {
		x: [], y: [], z: [], 
		opacity:0.8,
		// color:'rgb(50,300,50)',
		type: 'mesh3d',
		// intensity: [],
		color:'Earth',
		lighting:{
			ambient: 0.1,
			diffuse: 1
		}
	};

	plotSet;

	layout = {
		scene:{
			aspectmode: "manual",
			aspectratio: { x: 1, y: 1, z: 1},
			// xaxis: {range: [-120, 120], autorange: false},
			// yaxis: {range: [-120, 120], autorange: false},
			zaxis: {autorange: true }
		},
		margin: { l: 0, r: 0, b: 0, t: 0 },
		showlegend: false
	};

	updateModel(randomize = false){

		if(randomize){
			let dWeib = jStat.weibull.sample(this.models.dwL, this.models.dwK);
			
			this.models.defDap = dWeib;

			let hDens = this.models.hRange.map(res => res.den);
			let hMaxIndex = hDens.indexOf(Math.max(...hDens));

			let hMin = (hMaxIndex - 10) < 0 ? 0 : (hMaxIndex - 10);
			let hMax = (hMaxIndex + 10) >= hDens.length ? hDens.length :  (hMaxIndex + 10);

			let hWeib;
			do{
				hWeib = jStat.weibull.sample(this.models.hwL, this.models.hwK);
			}while(hWeib < hMin || hWeib > hMax);

			this.models.defHt = hWeib;
		}

		let data;
		data = this.models.modelsList[ this.models.active ];
		return data.function();
	}

	plot3d(single: boolean = false, sameView: boolean = false){

		this.plotSet = [];
	
		let nx = 0;
		while(nx < this.models.plantio.max(true)){
			let ny = 0;
			while(ny < this.models.plantio.max(false)){

				let data = this.updateModel(true);
				let x2d = data.map(xy => xy.x);
				let y2d = data.map(xy => xy.y);

				let x3d = [];
				let y3d = [];
				let z3d = [];
				// let intensity = [];
				// let tempInt = 0;

				for(let i = 0; i < x2d.length; ++i){
					let z = y2d[i];
					// tempInt = (y2d.length - i) / y2d.length;

					for(let j = 0; j < 360; j += 30){
						let y = x2d[i] * Math.sin( j * Math.PI / 180 );
						let x = x2d[i] * Math.cos( j * Math.PI / 180 );
						
						x3d.push(x + nx);
						y3d.push(y + ny);
						z3d.push(z);
						// intensity.push(tempInt);
					}
				}
				
				this.plotData.x = x3d;
				this.plotData.y = y3d;
				this.plotData.z = z3d;
				// this.plotData.intensity = intensity;

				this.plotSet.push( Object.assign({}, this.plotData) );

				ny += this.models.plantio.spy;
			}
			nx += this.models.plantio.spx;
		}

		Plotly.react('myDiv', this.plotSet, this.layout);

	};

  ionViewDidEnter(){

		if(this.models.active === -1){
			console.log('selecione um modelo');
		}

		this.models.fillSorted();
		this.plot3d();
	}

}
