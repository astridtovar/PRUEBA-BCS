import { test, expect } from "@playwright/test";
import { fillBasicData } from "./helpers";

test.describe("Save draft and resume", () => {
  test("user can navigate away mid-wizard and resume from the list", async ({
    page,
  }) => {
    // 1. Start new application
    await page.goto("/applications/new");

    // 2. Select channel
    await page.getByRole("radio", { name: /autogestión/i }).click();
    await page.getByRole("button", { name: /continuar/i }).click();

    // 3. Fill basic data and advance
    await fillBasicData(page);
    await page.getByRole("button", { name: /continuar/i }).click();

    // 4. Navigate away before finishing — go to applications list
    await page.goto("/applications");

    // 5. List should show the DRAFT application
    await expect(page.getByText("Borrador").first()).toBeVisible({ timeout: 10_000 });

    // 6. Click the row to open the draft detail
    const rows = page.getByRole("row");
    await rows.nth(1).click();

    // 7. Detail shows Edit button only for DRAFT
    await page.waitForURL(/\/applications\/[^/]+$/);
    await expect(page.getByRole("link", { name: /editar/i })).toBeVisible();
  });
});
