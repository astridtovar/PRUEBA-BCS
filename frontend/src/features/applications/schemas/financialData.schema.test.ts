import { financialDataSchema } from "./financialData.schema";

const valid = {
  monthlyIncome: 3000000,
  monthlyExpenses: 1200000,
  requestedAmount: 2000000,
  termMonths: 24,
  creditPurpose: "Home renovation and improvements",
  dataProcessingAccepted: true,
};

describe("financialDataSchema", () => {
  it("accepts valid financial data", () => {
    expect(financialDataSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects when expenses exceed income", () => {
    const result = financialDataSchema.safeParse({ ...valid, monthlyExpenses: 4000000 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.monthlyExpenses).toBeDefined();
    }
  });

  it("rejects when dataProcessingAccepted is false", () => {
    expect(
      financialDataSchema.safeParse({ ...valid, dataProcessingAccepted: false }).success
    ).toBe(false);
  });

  it("rejects term below minimum (6 months)", () => {
    expect(financialDataSchema.safeParse({ ...valid, termMonths: 3 }).success).toBe(false);
  });

  it("rejects term above maximum (120 months)", () => {
    expect(financialDataSchema.safeParse({ ...valid, termMonths: 150 }).success).toBe(false);
  });

  it("rejects negative requested amount", () => {
    expect(
      financialDataSchema.safeParse({ ...valid, requestedAmount: -1000 }).success
    ).toBe(false);
  });

  it("rejects credit purpose shorter than 5 chars", () => {
    expect(financialDataSchema.safeParse({ ...valid, creditPurpose: "Hi" }).success).toBe(false);
  });
});
