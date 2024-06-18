import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Paging, PagingController } from "src/common/paging";
import { isEnterKey } from "src/common/condition";

export interface ApiListStatisticsReq {
  paging?: Paging;
  aggType?: string; // Aggregation Type.
  aggRange?: string; // Aggregation Range. The corresponding year (YYYY), month (YYYYMM), sunday of the week (YYYYMMDD).
  currency?: string; // Currency
}

export interface ApiListStatisticsRes {
  aggType?: string; // Aggregation Type.
  aggRange?: string; // Aggregation Range. The corresponding year (YYYY), month (YYYYMM), sunday of the week (YYYYMMDD).
  aggValue?: string; // Aggregation Value.
  currency?: string; // Currency
}

@Component({
  selector: "app-cashflow-statistics",
  template: `
    <div>
      <h3 class="mt-2 mb-3">Cashflow Statistics</h3>
    </div>

    <div class="row row-cols-lg-auto g-3 align-items-center">
      <mat-form-field style="width: 300px;" class="mb-1 mt-3">
        <mat-label>Currency</mat-label>
        <input
          matInput
          type="text"
          [(ngModel)]="listReq.currency"
          (keyup)="isEnterKey($event) && fetchList()"
        />
        <button
          *ngIf="listReq.currency"
          matSuffix
          aria-label="Clear"
          (click)="listReq.currency = ''"
          class="btn-close"
        ></button>
      </mat-form-field>
    </div>

    <div class="row row-cols-lg-auto g-3 align-items-center">
      <div class="col">
        <mat-form-field>
          <mat-label>Category</mat-label>
          <mat-select
            (valueChange)="listReq.aggType = $event"
            [value]="listReq.aggType"
          >
            <mat-option
              [value]="option.value"
              *ngFor="
                let option of [
                  { name: 'Yearly', value: 'YEARLY' },
                  { name: 'Monthly', value: 'MONTHLY' },
                  { name: 'Weekly', value: 'WEEKLY' }
                ]
              "
            >
              {{ option.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
      <button mat-raised-button class="m-2" (click)="fetchList()">Fetch</button>
      <button mat-raised-button class="m-2" (click)="reset()">Reset</button>
    </div>

    <div class="mt-3 mb-2" style="overflow: auto;">
      <table mat-table [dataSource]="dat" style="width: 100%;">
        <ng-container matColumnDef="aggType">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let u">{{ u.aggType }}</td>
        </ng-container>

        <ng-container matColumnDef="aggRange">
          <th mat-header-cell *matHeaderCellDef>Range</th>
          <td mat-cell *matCellDef="let u">{{ u.aggRange }}</td>
        </ng-container>

        <ng-container matColumnDef="aggValue">
          <th mat-header-cell *matHeaderCellDef>Amount</th>
          <td mat-cell *matCellDef="let u">{{ u.aggValue }}</td>
        </ng-container>

        <ng-container matColumnDef="currency">
          <th mat-header-cell *matHeaderCellDef>Currency</th>
          <td mat-cell *matCellDef="let u">{{ u.currency }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="tabcol"></tr>
        <tr mat-row *matRowDef="let row; columns: tabcol"></tr>
      </table>
    </div>

    <app-controlled-paginator
      (controllerReady)="onPagingControllerReady($event)"
    ></app-controlled-paginator>
  `,
  styles: [],
})
export class CashflowStatisticsComponent implements OnInit {
  tabcol = ["aggType", "aggRange", "aggValue", "currency"];
  dat: ApiListStatisticsRes[] = [];
  pagingController: PagingController;
  listReq: ApiListStatisticsReq = {
    aggType: "YEARLY",
  };
  isEnterKey = isEnterKey;

  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}
  ngOnInit(): void {}

  fetchList() {
    this.http
      .post<any>(`/acct/open/api/v1/cashflow/list-statistics`, this.listReq)
      .subscribe({
        next: (resp) => {
          if (resp.error) {
            this.snackBar.open(resp.msg, "ok", { duration: 6000 });
            return;
          }
          this.dat = resp.data.payload;
          this.pagingController.onTotalChanged(resp.data.paging);
          if (this.dat == null) {
            this.dat = [];
          }
        },
        error: (err) => {
          console.log(err);
          this.snackBar.open("Request failed, unknown error", "ok", {
            duration: 3000,
          });
        },
      });
  }

  reset() {
    this.listReq = {
      aggType: "YEARLY",
    };
    this.pagingController.firstPage();
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchList();
    this.fetchList();
  }
}
