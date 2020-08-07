import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
declare var google;
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.page.html',
  styleUrls: ['./direction.page.scss'],
})
export class DirectionPage implements OnInit, AfterViewInit {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;
  constructor(private fb: FormBuilder,private nativeGeocoder: NativeGeocoder) {
    this.createDirectionForm();
  }

  ngOnInit() {
  }

  createDirectionForm() {
    this.directionForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 7,
      center: {lat: -0.244233, lng: -78.502447}
    });
    this.directionsDisplay.setMap(map);
  }

  calculateAndDisplayRoute(formValues) {
    const that = this;
    this.directionsService.route({
      origin: formValues.source,
      destination: formValues.destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      console.log(response, status);
      
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);

      
        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
      };
        this.nativeGeocoder.forwardGeocode('Colegio Montufar', options)
        .then((result: NativeGeocoderResult[]) =>{
          alert('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude);
          //calculates distance between two points in km's

          var p1 = new google.maps.LatLng(-0.236381, -78.508068);
          var p2 = new google.maps.LatLng(-0.242377, -78.501721);
  
          console.log("calculo de distancia kms",(google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2));
        }, error=>{
          console.log(error);
        })
        
        
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }


}
