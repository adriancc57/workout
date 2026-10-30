export function calendar(data, date) {
 const start=Date.parse(data.fechaInicio+'T00:00:00Z'), current=Date.parse(date+'T00:00:00Z');
 if(!Number.isFinite(current)) throw Error('Fecha inválida');
 const days=Math.floor((current-start)/86400000),week=Math.floor(days/7)+1;
 const day=['domingo','lunes','martes','miercoles','jueves','viernes','sabado'][new Date(current).getUTCDay()];
 return {week,day,status:days<0?'previa':week>data.duracionSemanas?'finalizado':'activo',routine:data.calendario[week%2===0?'semanaPar':'semanaImpar'][day]};
}
export class Session {
 constructor(exercises, now=()=>performance.now()){this.exercises=structuredClone(exercises);this.now=now;this.state='idle';this.index=0;this.series=1;this.side=0;this.results=[];this.elapsed=0;this.phaseElapsed=0;this.last=now();this.paused=false;this.pending=null;}
 get exercise(){return this.exercises[this.index];}
 get target(){return this.state==='preparacion'?3:this.state==='descanso'?this.exercise.descanso.segundos:this.exercise?.duracionSegundos?.objetivo;}
 get remaining(){return Math.max(0,(this.target||0)-this.phaseElapsed);}
 setState(s){this.state=s;this.phaseElapsed=0;}
 start(){if(!this.exercises.length)return;this.last=this.now();this.setState('preparacion');}
 tick(){const n=this.now(),dt=Math.max(0,(n-this.last)/1000);this.last=n;if(this.paused||['idle','finalizado'].includes(this.state))return;
 if(this.state!=='preparacion')this.elapsed+=dt;
 if(this.state==='espera')return;
 this.phaseElapsed+=dt;
 if(this.state==='preparacion'&&this.remaining===0)this.setState('ejercicio');
 else if(this.state==='descanso'&&this.remaining===0)this.advance();
 else if(this.state==='ejercicio'&&this.exercise.tipo==='tiempo'&&this.remaining===0)this.complete();
 }
 pause(){this.tick();this.paused=!this.paused;this.last=this.now();}
 nextPosition(){return this.series<this.exercise.series?{index:this.index,series:this.series+1}:{index:this.index+1,series:1};}
 wait(next){this.pending=next;this.setState('espera');}
 ready(){if(this.state!=='espera')return;const p=this.pending;this.pending=null;if(p.side!==undefined){this.side=p.side;this.setState('ejercicio');}else this.apply(p);}
 apply(p){this.index=p.index;this.series=p.series;this.side=0;if(this.index>=this.exercises.length)this.setState('finalizado');else this.setState('ejercicio');}
 advance(){this.apply(this.nextPosition());}
 complete(partial=false){if(this.paused||this.state!=='ejercicio')return;
 const e=this.exercise;
 if(partial){this.results.push({id:e.id,serie:this.series,estado:'parcial'});this.wait({index:this.index+1,series:1});return;}
 if(e.lados.modo==='secuencial'&&this.side===0){this.wait({side:1});return;}
 this.results.push({id:e.id,serie:this.series,estado:'completada'});
 const next=this.nextPosition();if(next.index>=this.exercises.length){this.apply(next);return;}
 if(e.descanso.tipo==='manual')this.wait(next);
 else if(e.descanso.segundos>0)this.setState('descanso');else this.apply(next);
 }
 skip(){if(this.paused||!['ejercicio','descanso','espera'].includes(this.state))return;this.results.push({id:this.exercise.id,serie:this.series,estado:'omitido'});this.wait({index:this.index+1,series:1});}
}
