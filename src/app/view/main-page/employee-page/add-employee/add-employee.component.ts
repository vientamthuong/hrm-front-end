import {NotificationService} from '../../../../service/notification/notification.service';
import {EmployeePageService} from '../../../../service/main-page/employee-page/employee-page.service';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  public ids: string[] = [];

  public form: FormGroup = this.formBuilder.group(
    {
      gender: ['MALE',],
      firstName: ['', [Validators.required, Validators.min(5), Validators.max(50)]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      id: ['',],
      date: [new Date().toISOString().slice(0, 16),]
    }
  );

  constructor(
    public employeePageService: EmployeePageService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.employeePageService.getAllIdDepartment().subscribe(data => {
      for (let i = 0; i < data.data.length; i++) {
        this.ids.push(data.data[i].id);
      }
      this.form.patchValue(
        {
          id: this.ids[0] + "",
        }
      );
    })
  }

  public addEmployee(): void {
    if (this.form.valid) {
      let body = {
        address: this.form.value.address,
        city: this.form.value.city,
        doB: this.form.value.date.slice(0, 10),
        email: this.form.value.email,
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        gender: this.form.value.gender,
        department: parseInt(this.form.value.id),
      };
      this.employeePageService.addNewEmployee(body).subscribe(data => {
        console.log(data);
        this.employeePageService.isShowNotification = true;
        if (data.status == "500 INTERNAL_SERVER_ERROR") {
          this.notificationService.titlePopUpNotificationEmployee = `Already exists staff with email: ${this.form.value.email}`;
        } else {
          this.notificationService.titlePopUpNotificationEmployee = `You have successfully added the employee #${data.data.id}`;
          this.employeePageService.loadData(0);
        }
      });
    }
  }

  public back(): void {
    this.employeePageService.isAddEmployee = false;
  }

  public clear(): void {
    this.form.patchValue(
      {
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
      }
    );
  }

}
