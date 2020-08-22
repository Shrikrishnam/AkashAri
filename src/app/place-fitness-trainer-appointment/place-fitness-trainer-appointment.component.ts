import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {  FormGroup, FormBuilder, Validators} from "@angular/forms";
import { UserService } from '../_services';
import { Router, ActivatedRoute } from "@angular/router";

export class Fitness {
  constructor(
    //public inr: number,
    //public paisa: number,
    public streetaddress: string,
    //public city: string,
    //public state: string,
    //public country: string,
    public pincode: number,
    //public phonenumber: number,
    public email: string,
    public firstname:string,
    public lastname: string,
    public age:number,
    //public trainerpreference: string,
    //public physiotherapist: string,
    public packages: string
  ) { }
}

@Component({
  selector: 'app-place-fitness-trainer-appointment',
  templateUrl: './place-fitness-trainer-appointment.component.html'
  
})
export class PlaceFitnessTrainerAppointmentComponent implements OnInit {

  @Output() fitnessdata = new EventEmitter<Fitness>();
  fitnessForm: FormGroup;
  public obj: any = {};
  userData:any={};

  constructor(private fb: FormBuilder, private backend: UserService, private router: Router, private actRoute: ActivatedRoute) { }
  
  ngOnInit() {
    let id= this.actRoute.snapshot.params.id;

    if(id && id!=0){
      this.backend.getUserData(id).subscribe(data=>{this.setData(data);
      })
    }

    this.fitnessForm = this.fb.group({
      firstname : ["",[Validators.required]],
      lastname : ["",[Validators.required]],
      age : ["",[Validators.required, Validators.min(18),Validators.max(60)]],
      email : ["",[Validators.required,Validators.email]],
      streetaddress : ["",[Validators.required]],
      pincode : ["",[Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    })
  }

  setData(data: Object){
    this.userData=data;
    this.fitnessForm.setValue({
      firstname:this.userData.firstname,
      lastname:this.userData.lastname,
      age:this.userData.age,
      email:this.userData.email,
      streetaddress:this.userData.streetaddress,
      pincode:this.userData.pincode,
      packages:this.userData.packages,
    })
  }

  onSubmit() {
  this.obj = {...this.fitnessForm.value, ...this.obj};
  this.fitnessForm.value;

  if(this.fitnessForm.valid){
    this.fitnessdata.emit(
      new Fitness(
        this.fitnessForm.value.firstname,
        this.fitnessForm.value.lastname,
        this.fitnessForm.value.age,
        this.fitnessForm.value.email,
        this.fitnessForm.value.streetaddress,
        this.fitnessForm.value.pincode,
        this.fitnessForm.value.packages
      )
    );

    if(!this.userData.id)
      this.backend.postfitnessdata(this.fitnessForm.value).subscribe(data=>console.log(data));
    else
        this.backend.updatefitnessdata(this.fitnessForm.value, this.userData.id).subscribe(data=>console.log(data));
      this.backend.postfitnessdata(this.fitnessForm.value);
      this.router.navigateByUrl("landing-page")  
    }else{
      console.log("INCOMPLETE");
      return;
    }
  
  }
    
}
