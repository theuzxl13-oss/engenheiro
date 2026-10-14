import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <div role="note" className="bg-gold-500 px-4 py-1.5 text-center text-xs font-medium text-navy-900">
      <Info className="mr-1.5 inline size-4 align-[-3px]" aria-hidden="true" />
      <strong>Modo demonstração</strong>
      <span className="hidden sm:inline">
        {" "}— textos entre colchetes, imagens e documentos são ilustrativos e serão substituídos pelos dados reais.
      </span>
    </div>
  );
}
