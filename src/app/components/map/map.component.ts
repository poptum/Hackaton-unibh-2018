import { Component, OnInit, NgZone } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  lat: number = -19.868267;
  lng: number = -43.934071;
  filtro: boolean = false;
  maxDist: number = 0;
  maxDistId: any;
  closerAgent: any;
  agentes = [

  ];
  labelOpt = {
    color: '#010000',
    fontFamily: '',
    fontSize: '14px',
    fontWeight: 'bold',
    text: 'descrição ocorrencia',
  }

  raio: number = 2;

  todosAgentes = [

  ];

  agentes2 = [
    // agentes precisa ser a resposta de um serviço 

    { id: '1', lat: -19.885336, long: -43.914242, ocorrencia: 'B' }, { id: '2', lat: -19.888132, long: -43.926259, ocorrencia: 'A' },
    { id: '3', lat: -19.891271, long: -43.933967, ocorrencia: 'D' }, { id: '4', lat: -19.885507, long: -43.946044, ocorrencia: 'C' },
    { id: '5', lat: -19.870896, long: -43.944952, ocorrencia: 'B' }, { id: '6', lat: -19.863932, long: -43.939247, ocorrencia: 'A' },
  ];

  ocorrencias = [

  ];

  constructor(private socket: Socket, private zone: NgZone) {

    this.getAgentes().subscribe(message => {
      //plotar novo ponto no mapa
      let lat = message['lat']
      let long = message['lng']
      console.log('agentes')
      console.log(lat)
      console.log(long)
      this.zone.run(() => { // <== added
        let distance = this.getDistanceFromLatLonInKm(lat, long, this.lat, this.lng);
        console.log(distance)
        console.log(this.maxDist)

        if (distance < this.raio) {
          if (distance > this.maxDist) {
            console.log('entrou max duscits')
            console.log(message['id'])
            this.zone.run(() => { // <== added
              this.maxDist = distance;
              this.maxDistId = message['id'];
              this.closerAgent = message['id'];
            });
          }
          this.agentes.push({ id: message['id'], lat: lat, long: long, ocorrencia: message['ocorrencia'], distance: distance, labelOpt: { text: message['id'] } })
        }
        this.todosAgentes.push({ id: message['id'], lat: lat, long: long, ocorrencia: message['ocorrencia'], distance: distance, labelOpt: { text: message['id'] } })
      });
    });

    this.getOcorrencia().subscribe(message => {
      //plotar novo ponto no mapa
      console.log('getOcorrencias')
      console.log(message)
      let lat = +message['lat']
      let long = +message['lng']
      for (var x = 0; x < this.agentes2.length; x++) {
        console.log('localizacao')
        console.log(this.agentes2[x].lat)
        console.log(this.agentes2[x].long)

        this.socket.emit('localizacao', { id: this.agentes2[x].id, lat: this.agentes2[x].lat, lng: this.agentes2[x].long, ocorrencia: this.agentes2[x].ocorrencia });
      }
      this.zone.run(() => { // <== added
        this.ocorrencias.push({ id: '1', lat: lat, long: long, ocorrencia: 'A' })
      });
    });
  }


  ngOnInit() {
    this.socket.connect();
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  updateAgentes() {
    let distance
    this.maxDist = 0;
    this.agentes = [];
    for (var i = 0; i < this.todosAgentes.length; i++) {
      distance = this.getDistanceFromLatLonInKm(this.todosAgentes[i].lat, this.todosAgentes[i].long, this.lat, this.lng);
      console.log(distance)
      if (distance < this.raio) {
        if (this.filtro) {
          if (this.aplicaFiltro(this.todosAgentes[i])) {
            if (distance > this.maxDist) {
              this.maxDist = distance;
              this.maxDistId = this.todosAgentes[i]['id'];
              this.closerAgent = this.todosAgentes[i]['id'];
            }
            this.zone.run(() => { // <== added
              this.agentes.push({ id: '1', lat: this.todosAgentes[i].lat, long: this.todosAgentes[i].long, ocorrencia: 'A', labelOpt: { text: this.todosAgentes[i]['id'] } })
            });
          }
        } else {
          if (distance > this.maxDist) {
            this.maxDist = distance;
            this.maxDistId = this.todosAgentes[i]['id'];
            this.closerAgent = this.todosAgentes[i]['id'];
          }
          this.zone.run(() => { // <== added
            this.agentes.push({ id: '1', lat: this.todosAgentes[i].lat, long: this.todosAgentes[i].long, ocorrencia: 'A', labelOpt: { text: this.todosAgentes[i]['id'] } })
          });
        }
      }
    }
  }

  getOcorrencia() {
    let observable = new Observable(observer => {
      this.socket.on('ocorrencia', (data) => {
        console.log('ocorrencia front end')
        observer.next(data);
      });
    })
    return observable;
  }


  getAgentes() {
    let observable = new Observable(observer => {
      this.socket.on('atualizaLoc', (data) => {
        console.log('ocorrencia front end')
        observer.next(data);
      });
    })
    return observable;
  }

  filter() {
    this.filtro = true;
    let distance
    this.agentes = [];
    this.maxDist = 0;
    for (var i = 0; i < this.todosAgentes.length; i++) {
      distance = this.getDistanceFromLatLonInKm(this.todosAgentes[i].lat, this.todosAgentes[i].long, this.lat, this.lng);
      console.log(distance)
      if (distance < this.raio) {
        if (this.aplicaFiltro(this.todosAgentes[i])) {
          console.log('plotou')
          if (distance > this.maxDist) {
            this.maxDist = distance;
            this.maxDistId = this.todosAgentes[i]['id'];
            this.closerAgent = this.todosAgentes[i]['id'];
          }
          this.zone.run(() => { // <== added
            this.agentes.push({ id: '1', lat: this.todosAgentes[i].lat, long: this.todosAgentes[i].long, ocorrencia: 'A', labelOpt: { text: this.todosAgentes[i]['id'] } })
          });
        }
      }
    }

  }

  aplicaFiltro(json) {
    if (json.ocorrencia == this.ocorrencias[0]['ocorrencia'])
      return true
    else
      return false
  }

  cleanFilter() {
    this.filtro = false;
    this.updateAgentes();
  }



}
