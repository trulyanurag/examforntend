import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  

  constructor(private userService:UserService, private snack:MatSnackBar,private login:LoginService,private router:Router) { }
  public user = {
    username: '',
    password:'',
    firstName:'',
    lastName:'',
    email:'',
    phone:''
  }
  loginData={
    'username':'',
    'password':'',
  };
 
  ngOnInit(): void {}

  formSubmit(){
    if(this.user.username=='' || this.user.username==null)
    {
      this.snack.open("User Name is Required !!",'ok',{horizontalPosition: 'center',verticalPosition:'top'});
    }
    else
    this.userService.addUser(this.user).subscribe((user : any)=>
    {
       console.log(user);
       Swal.fire('Great !!',user.username +' is Successfully Registered ','success');

       //redirect to user dashboard
       this.loginData.username=this.user.username;
       this.loginData.password=this.user.password;

       this.login.generateToken(this.loginData).subscribe((data:any)=>{
        console.log("token generated");
        console.log(data);
         this.login.loginUser(data.token);
         this.login.setUser(user);
         if(this.login.getUserRole()=='NORMAL')
         {
           this.router.navigate(['user-dashboard']);
           this.login.loginStatusSubject.next(true);
         }
       },(error)=>{
        console.log("token generation failed");
        console.log(error);
        Swal.fire('Failed','  Incorrect username or password !!','error');
  
      });

       
    },
    (error)=>{
      console.warn(error);
      Swal.fire('Error !!', 'Please Enter Unique User Name','error');
    }
    );

  }

}


