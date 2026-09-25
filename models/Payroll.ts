import mongoose, { Schema, model, models, Document } from 'mongoose';

// -------------------------------------------------------------
// 1. TYPE DEFINITIONS (TypeScript Interfaces)
// -------------------------------------------------------------

export type PayBasis =
  | "Hourly"
  | "Salaried"
  | "Piece_Rate"
  | "Daily"
  | "Commission"
  | "Stipend";

export interface IPayrollCalculationInput {
  payBasis: PayBasis;
  baseRate?: mongoose.Types.Decimal128;
  currency?: string;
  payFrequency?: "Daily" | "Weekly" | "Biweekly" | "Semimonthly" | "Monthly";
  hoursWorked?: mongoose.Types.Decimal128;
  unitsWorked?: mongoose.Types.Decimal128;
  pieceRateUnit?: string;
  commissionRate?: mongoose.Types.Decimal128;
  commissionBase?: mongoose.Types.Decimal128;
}


export interface IBonusItem {
  description: string;
  amount: mongoose.Types.Decimal128; // Using Decimal128 for precise financial calculations
}

export interface IDeductionItem {
  description: string;
  amount: mongoose.Types.Decimal128; // Using Decimal128 for precise financial calculations
}

export interface IPayrollBreakdown {
  baseEarnings: mongoose.Types.Decimal128;
  overtimeEarnings: mongoose.Types.Decimal128;
  bonuses: IBonusItem[];
  deductions: IDeductionItem[];
  grossPay: mongoose.Types.Decimal128;
  totalDeductions: mongoose.Types.Decimal128;
  netPay: mongoose.Types.Decimal128;
}

export interface IPayrollPayment {
  method: 'CASH' | 'BANK_TRANSFER' | 'CHECK';
  paidAt?: Date;
  transactionReference?: string;
}
export interface IPayPeriod {
  periodStart: Date;
  periodEnd: Date;
}

export interface IPayroll extends Document {
  employeeId: mongoose.Types.ObjectId;
  calculationInput: IPayrollCalculationInput;
  payPeriod: IPayPeriod;
  breakdown: IPayrollBreakdown;
  payment?: IPayrollPayment;
  status: 'DRAFT' | 'APPROVED' | 'PAID';
  createdAt: Date;
  updatedAt: Date;
}

// -------------------------------------------------------------
// 2. MONGOOSE SUB-SCHEMAS (For Nested Objects)
// -------------------------------------------------------------
const BonusItemSchema = new Schema<IBonusItem>({
  description: { type: String, required: true },
  amount: { type: Schema.Types.Decimal128, required: true, min: 0 }
}, { _id: false }); // Prevents generating a separate _id for each array element

const DeductionItemSchema = new Schema<IDeductionItem>({
  description: { type: String, required: true },
  amount: { type: Schema.Types.Decimal128, required: true, min: 0 }
}, { _id: false });

const BreakdownSchema = new Schema<IPayrollBreakdown>({
  baseEarnings: { type: Schema.Types.Decimal128, required: true, default: 0, min: 0 },
  overtimeEarnings: { type: Schema.Types.Decimal128, required: true, default: 0, min: 0 },
  bonuses: { type: [BonusItemSchema], default: [] },
  deductions: { type: [DeductionItemSchema], default: [] },
  grossPay: { type: Schema.Types.Decimal128, required: true, min: 0 },
  totalDeductions: { type: Schema.Types.Decimal128, required: true, min: 0 },
  netPay: { type: Schema.Types.Decimal128, required: true, min: 0 }
}, { _id: false });

const PaymentSchema = new Schema<IPayrollPayment>({
  method: {
    type: String,
    enum: ['CASH', 'BANK_TRANSFER', 'CHECK'],
    required: true
  },
  paidAt: {
    type: Date,
    required: function (this: { $parent: () => IPayroll }) {
      return this.$parent()?.status === 'PAID';
    }
  },
  transactionReference: { type: String }
}, { _id: false });

const CalculationInputSchema = new Schema<IPayrollCalculationInput>(
  {
    payBasis: {
      type: String,
      enum: [
        "Hourly",
        "Salaried",
        "Piece_Rate",
        "Daily",
        "Commission",
        "Stipend"
      ],
      required: true
    },
    baseRate: {
      type: Schema.Types.Decimal128,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true
    },
    payFrequency: {
      type: String,
      required: true
    },
    hoursWorked: {
      type: Schema.Types.Decimal128,
      min: 0
    },
    unitsWorked: {
      type: Schema.Types.Decimal128,
      min: 0
    },
    pieceRateUnit: {
      type: String,
      trim: true
    },
    commissionRate: {
      type: Schema.Types.Decimal128,
      min: 0,
      max: 100
    },
    commissionBase: {
      type: Schema.Types.Decimal128,
      min: 0
    }
  },
  { _id: false }
);

const PayPeriodSchema = new Schema<IPayPeriod>({
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true }
}, { _id: false });

// -------------------------------------------------------------
// 3. CORE PAYROLL SCHEMA & MODEL
// -------------------------------------------------------------
const PayrollSchema = new Schema<IPayroll>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    calculationInput: {
      type: CalculationInputSchema,
      required: true
    },
    payPeriod: {
      type: PayPeriodSchema,
      required: true
    },
    breakdown: { type: BreakdownSchema, required: true },
    payment: {
      type: PaymentSchema,
      required: function (this: IPayroll) {
        return this.status === 'PAID';
      }

    },
    status: {
      type: String,
      enum: ['DRAFT', 'APPROVED', 'PAID'],
      default: 'DRAFT',
      required: true
    }
  },
  {
    timestamps: true // Automatically adds and manages createdAt and updatedAt fields
  }
);

PayrollSchema.pre('validate', function () {
  if (this.status === 'PAID') {
    if (!this.payment?.paidAt) {
      this.invalidate(
        'payment.paidAt',
        'Payment date is required for paid payroll.'
      );
    }

    if (
      this.payment?.method === 'BANK_TRANSFER' &&
      !this.payment.transactionReference
    ) {
      this.invalidate(
        'payment.transactionReference',
        'Bank transfers require a transaction reference.'
      );
    }
  }

  const input = this.calculationInput;

  if (input?.payBasis === "Hourly" && input.hoursWorked == null) {
    this.invalidate(
      "calculationInput.hoursWorked",
      "Hourly payroll requires hours worked."
    );
  }

  if (
    input?.payBasis === "Piece_Rate" &&
    (input.pieceRateUnit == null || input.unitsWorked == null)
  ) {
    this.invalidate(
      "calculationInput",
      "Piece-rate payroll requires a unit and units worked."
    );
  }

  if (
    input?.payBasis === "Commission" &&
    (input.commissionRate == null || input.commissionBase == null)
  ) {
    this.invalidate(
      "calculationInput",
      "Commission payroll requires commission rate and commission base."
    );
  }


  if (
  this.payPeriod?.periodStart &&
  this.payPeriod?.periodEnd &&
  this.payPeriod.periodStart > this.payPeriod.periodEnd
) {
  this.invalidate(
    "payPeriod",
    "Pay period start must be before pay period end."
  );
}

});


// Crucial: Compound index preventing duplicate payouts for the same worker in the same cycle.
PayrollSchema.index(
  {
    employeeId: 1,
    "payPeriod.periodStart": 1,
    "payPeriod.periodEnd": 1
  },
  { unique: true }
);

PayrollSchema.index({ employeeId: 1 });
PayrollSchema.index({ status: 1 });

export const Payroll = models.Payroll || model<IPayroll>('Payroll', PayrollSchema);
