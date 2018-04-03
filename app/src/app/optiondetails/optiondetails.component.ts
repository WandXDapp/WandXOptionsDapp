import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-optiondetails',
  templateUrl: './optiondetails.component.html',
  styleUrls: ['./optiondetails.component.css']
})
export class OptionDetailsComponent implements OnInit {

  id: any;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      let userId = params['userId'];
    });

    this.id = window.location.href.replace('http://localhost:4200/optiondetails/', '');
    console.log(this.id);
  }

}
