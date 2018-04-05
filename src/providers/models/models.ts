import { Injectable } from '@angular/core';
import * as katex from 'katex';

@Injectable()
export class ModelsProvider {

  defDap = 30;
  defHt = 25;
  step: number = 1;
  active: number = -1;
  
  dwL: number = 30;
  dwK: number = 3.5;
  hwL: number = 22;
  hwK: number = 3;

  plantio = {
		spx: 1.5 * 100,
		spy: 1.5 * 100,
		nx: 4,
    ny: 4,
    skip: 0.05,
		max(x: boolean){
			return ( x ? (this.spx * this.nx) : (this.spy * this.ny) ); 
		}
	}

  setDH(d, h){
    this.defDap = d;
    this.defHt = h;
  };

  dWeibull(x, k, l){
    let den = (k/l) * Math.pow(x/l, k-1) * Math.exp(-Math.pow(x/l, k));
    return den < 0 ? 0 : den;
  }

  modelsList: Array<Object> = [
    {
      author: 'Hojer',
      year: 1903,
      model: katex.renderToString("\\frac{ d_i }{ DAP } = \\beta_0 \\ln{ (\\frac{ \\beta_1 + \\frac{ Ht - h_i }{ Ht - 1.3 } }{ \\beta_2 } ) }"),
      coef: [
        {beta: katex.renderToString("\\beta_0 ="), val: 11.555168},
        {beta: katex.renderToString("\\beta_1 ="), val: 12.195512},
        {beta: katex.renderToString("\\beta_2 ="), val: 12.292301}
      ],
      parent: this,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;
        let b2 = this.coef[2].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let z = (this.parent.defHt - i) / (this.parent.defHt - 1.3);
          let y = b0 * Math.log((b1 + z) / b2);
          let dt = y * this.parent.defDap;
          dt = (dt > 0 ? dt : 0);
          di.push({x: dt, y: i});
        }

        return di;
      }
    },
    {
      author: 'Kozac et al.',
      year: 1969,
      model: katex.renderToString("(\\frac{d_i}{DAP})^2 = \\beta_0 + \\beta_1(\\frac{h_i}{Ht}) + \\beta_2(\\frac{h_i}{Ht})^2"),
      coef: [
        {beta: katex.renderToString("\\beta_0 ="), val: 1.389554},
        {beta: katex.renderToString("\\beta_1 ="), val: -2.660052},
        {beta: katex.renderToString("\\beta_2 ="), val: 1.308719}
      ],
      parent: this,
      function(){
        let b0 = this.coef[0].val;
        let b1 = this.coef[1].val;
        let b2 = this.coef[2].val;

        let di: Array<Object> = [];
        for(let i = 0.01; i <= this.parent.defHt; i += this.parent.step){
          let ysq = b0 + b1*(i/this.parent.defHt) + b2*Math.pow(i/this.parent.defHt,2);
          let dt = Math.sqrt(ysq) * this.parent.defDap;
          dt = (dt > 0 ? dt : 0); 
          di.push({x: dt, y: i});
        }

        return di;
        
      }
    }
  ];

  dRange;
  hRange;
  fillSorted(){
    this.dRange = [];
    this.hRange = []; 
    for(let i = 0, j = 0; i < 100; i++, j+=0.5){
      let dd = this.dWeibull(i, this.dwK, this.dwL);
      let hd = this.dWeibull(j, this.hwK, this.hwL);

      this.dRange.push({ den: dd, qtl: i });
      this.hRange.push({ den: hd, qtl: j });
    }
  }

  constructor() {}

}
