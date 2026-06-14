import { Page } from "@playwright/test";

export async function fillBasicData(page: Page) {
  // Shadcn Select — not a native <select>, must click trigger then option
  await page.getByLabel(/tipo de documento/i).click();
  await page.getByRole("option", { name: /cédula de ciudadanía/i }).click();

  await page.fill('[name="documentNumber"]', "12345678");
  await page.fill('[name="firstName"]', "John");
  await page.fill('[name="lastName"]', "Doe");
  await page.fill('[name="phone"]', "3001234567");
  await page.fill('[name="email"]', "john.doe@example.com");
  await page.fill('[name="city"]', "Bogotá");
}

export async function fillFinancialData(page: Page, amount = "2000000") {
  // CurrencyInputs use Controller (no name attr) — locate via label
  await page.getByLabel(/ingresos mensuales/i).fill("5000000");
  await page.getByLabel(/gastos mensuales/i).fill("1500000");
  await page.getByLabel(/monto solicitado/i).fill(amount);
  await page.fill('[name="termMonths"]', "24");
  await page.fill('[name="creditPurpose"]', "Remodelación del hogar y mejoras generales.");

  const checkbox = page.getByLabel(/autorizo/i);
  if (!(await checkbox.isChecked())) {
    await checkbox.check();
  }
}
