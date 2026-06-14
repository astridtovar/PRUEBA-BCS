import { basicDataSchema } from "./basicData.schema";

const valid = {
  documentType: "CC" as const,
  documentNumber: "12345678",
  firstName: "John",
  lastName: "Doe",
  phone: "3001234567",
  email: "john@example.com",
  city: "Bogotá",
};

describe("basicDataSchema", () => {
  it("accepts valid data", () => {
    expect(basicDataSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = basicDataSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects short document number", () => {
    expect(basicDataSchema.safeParse({ ...valid, documentNumber: "12" }).success).toBe(false);
  });

  it("rejects empty first name", () => {
    expect(basicDataSchema.safeParse({ ...valid, firstName: "A" }).success).toBe(false);
  });

  it("rejects invalid phone characters", () => {
    expect(basicDataSchema.safeParse({ ...valid, phone: "abc-phone" }).success).toBe(false);
  });

  it("requires all mandatory fields", () => {
    expect(basicDataSchema.safeParse({}).success).toBe(false);
  });
});
