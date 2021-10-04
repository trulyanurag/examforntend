import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData={
    'username':'',
    'password':'',
  };
  
  constructor(private snack:MatSnackBar, private login:LoginService, private router: Router) { }

  ngOnInit(): void {
    
  }

  formSubmit(){
   
    if(this.loginData.username.trim()=='' || this.loginData.username==null)
    {
        this.snack.open('User Name is Required !!','ok');
    }
    else if(this.loginData.password.trim()=='' || this.loginData.password==null)
    {
      this.snack.open('Password is Required !!','ok');
    }
    else{
      //Swal.fire('Success','Loged In !!','success');
      console.log("submited successfully");
    }

    this.login.generateToken(this.loginData).subscribe((data : any)=>{
      console.log("token generated");
      console.log(data);
       
      // login process
      this.login.loginUser(data.token);
      this.login.getCurrentUser().subscribe((user:any)=>{
        this.login.setUser(user);
        console.log(user);

        //redirect.....ADMIN: Admin Dashboard
        if(this.login.getUserRole()=='ADMIN')
        {
          this.router.navigate(['admin']);
          this.login.loginStatusSubject.next(true);
        }
        //redirect.....User: User Dashboard
        if(this.login.getUserRole()=='NORMAL')
        {
          this.router.navigate(['user-dashboard']);
          this.login.loginStatusSubject.next(true);
        }
      },
      (error)=>{
        console.log("Error in getting current user !!"+error);

      });

    },
    (error)=>{
      console.log("token generation failed");
      console.log(error);
      Swal.fire('Failed','  Incorrect username or password !!','error');

    });
  }

}
