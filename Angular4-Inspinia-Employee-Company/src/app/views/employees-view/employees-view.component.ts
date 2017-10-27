import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeeService } from './employees-view.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'employeesView',
    templateUrl: 'employees-view.template.html',
    styleUrls: ['./employees-view.template.css']
})
export class employeesViewComponent implements OnInit, OnDestroy {
  private employees: any = [];
  private errorMsg: any;
  private loading: boolean;
  private sub: any;
  private queryString: string;
  private companyID: any;

  // pagination
  total: number;
  p: any;
  pageSize: number;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let page = +this.route.snapshot.queryParams['page'] || 1;
      this.companyID = +params['id'] || null;
      this.getEmployeesPage(page, this.companyID);
    });
  }

  getEmployeesPage(page: number, companyID: any) {
    this.loading = true;
    this.employeeService.getEmployees(page, companyID, this.queryString).then((employees) => {
      this.loading = false;
      this.employees = employees.items;
      this.total = employees.total;
      this.pageSize = employees.pageSize;
      this.p = page;

      this.router.navigate([], {queryParams: {page}}); // change page number on url, so when editing employee we come back to right page
    }).catch((errorMessage) => {
      this.loading = false;
      this.errorMsg = errorMessage;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
