import type { Metadata } from "next";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { BenefitsGrid } from "@/features/landing/components/BenefitsGrid";
import { RequirementsSection } from "@/features/landing/components/RequirementsSection";
import { CtaBanner } from "@/features/landing/components/CtaBanner";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Solicita tu crédito de libre destino de forma rápida y segura. Proceso 100% digital, respuesta ágil.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsGrid />
      <RequirementsSection />
      <CtaBanner />
    </>
  );
}
