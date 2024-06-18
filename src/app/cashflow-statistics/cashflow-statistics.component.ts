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
      <div class="col">
        <mat-form-field>
          <mat-label>Type</mat-label>
          <mat-select
            (valueChange)="onAggTypeSelected($event)"
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

    <div class="row row-cols-lg-auto g-3 align-items-center">
      <div class="col">
        <mat-form-field>
          <mat-label>Currency</mat-label>
          <mat-select
            (valueChange)="onCurrencySelected($event)"
            [value]="listReq.currency"
          >
            <mat-option [value]="option" *ngFor="let option of currencies">
              {{ option }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <plotly-plot [data]="graph.data" [layout]="graph.layout"></plotly-plot>

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
  currencies = [];
  pagingController: PagingController;
  listReq: ApiListStatisticsReq = {
    aggType: "YEARLY",
  };
  isEnterKey = isEnterKey;

  public graph = {
    data: [
      {
        x: [1, 2, 3],
        y: [2, 6, 3],
        type: "scatter",
        mode: "lines+points",
        marker: { color: "red" },
      },
      { x: [1, 2, 3], y: [2, 5, 3], type: "bar" },
    ],
    layout: { width: 900, height: 300, title: "A Fancy Plot" },
  };

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

    this.fetchCurrencies();
  }

  reset() {
    this.listReq = {
      aggType: "YEARLY",
    };
    if (!this.pagingController.firstPage()) {
      this.fetchList();
    }
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchList();
    this.fetchList();
  }

  onCurrencySelected(currency) {
    this.listReq.currency = currency;
    if (!this.pagingController.firstPage()) {
      this.fetchList();
    }
  }

  onAggTypeSelected(aggType) {
    this.listReq.aggType = aggType;
    if (!this.pagingController.firstPage()) {
      this.fetchList();
    }
  }

  fetchCurrencies() {
    this.http.get<any>(`/acct/open/api/v1/cashflow/list-currency`).subscribe({
      next: (resp) => {
        if (resp.error) {
          this.snackBar.open(resp.msg, "ok", { duration: 6000 });
          return;
        }
        let dat: string[] = resp.data;
        if (dat == null) {
          dat = [];
        }
        this.currencies = dat;
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open("Request failed, unknown error", "ok", {
          duration: 3000,
        });
      },
    });
  }
}
