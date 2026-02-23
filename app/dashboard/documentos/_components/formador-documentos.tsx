"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Clock, Upload, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus = "válido" | "a expirar" | "expirado" | "em falta";

interface MeuDocumento {
  id: number;
  nome: string;
  status: DocStatus;
  dataUpload: string | null;
  dataValidade: string | null; // "YYYY-MM-DD" para o input date
  dataValidadeLabel: string | null; // para mostrar formatado
  temValidade: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const documentosIniciais: MeuDocumento[] = [
  { id: 1, nome: "CV",                   status: "válido",    dataUpload: "15 jan 2025", dataValidade: null,         dataValidadeLabel: null,           temValidade: false },
  { id: 2, nome: "Cartão de Cidadão",    status: "válido",    dataUpload: "15 jan 2025", dataValidade: "2027-03-20", dataValidadeLabel: "20 mar 2027",  temValidade: true  },
  { id: 3, nome: "CCP",                  status: "válido",    dataUpload: "15 jan 2025", dataValidade: "2028-06-01", dataValidadeLabel: "01 jun 2028",  temValidade: true  },
  { id: 4, nome: "IBAN",                 status: "válido",    dataUpload: "15 jan 2025", dataValidade: null,         dataValidadeLabel: null,           temValidade: false },
  { id: 5, nome: "Seguro",               status: "expirado",  dataUpload: "10 jan 2024", dataValidade: "2025-01-10", dataValidadeLabel: "10 jan 2025",  temValidade: true  },
  { id: 6, nome: "Registo Criminal",     status: "válido",    dataUpload: "15 jan 2025", dataValidade: "2026-01-15", dataValidadeLabel: "15 jan 2026",  temValidade: true  },
  { id: 7, nome: "Certidão Finanças",    status: "a expirar", dataUpload: "15 jan 2025", dataValidade: "2026-03-01", dataValidadeLabel: "01 mar 2026",  temValidade: true  },
  { id: 8, nome: "Certidão Seg. Social", status: "a expirar", dataUpload: "15 jan 2025", dataValidade: "2026-03-15", dataValidadeLabel: "15 mar 2026",  temValidade: true  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<DocStatus, { label: string; icon: React.ElementType; iconClass: string; textClass: string; bgClass: string }> = {
  "válido":    { label: "Válido",     icon: CheckCircle2,  iconClass: "text-green-500", textClass: "text-green-600", bgClass: "bg-green-50"  },
  "a expirar": { label: "A Expirar",  icon: Clock,         iconClass: "text-amber-500", textClass: "text-amber-600", bgClass: "bg-amber-50"  },
  "expirado":  { label: "Expirado",   icon: AlertTriangle, iconClass: "text-red-500",   textClass: "text-red-600",   bgClass: "bg-red-50"    },
  "em falta":  { label: "Em Falta",   icon: AlertTriangle, iconClass: "text-gray-400",  textClass: "text-gray-500",  bgClass: "bg-gray-50"   },
};

// ─── Document Card ────────────────────────────────────────────────────────────

function DocCard({
  doc,
  onValidadeChange,
}: {
  doc: MeuDocumento;
  onValidadeChange: (id: number, value: string) => void;
}) {
  const cfg = STATUS_CONFIG[doc.status];
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 hover:border-purple-200 hover:shadow-sm transition-all">
      {/* Header — icon + name + status */}
      <div className="flex items-start gap-3">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", cfg.bgClass)}>
          <Icon className={cn("h-5 w-5", cfg.iconClass)} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-bold text-gray-900">{doc.nome}</span>
          <span className={cn("text-sm font-semibold", cfg.textClass)}>{cfg.label}</span>
        </div>
      </div>

      {/* Dates */}
      <div className="flex flex-col gap-1">
        {doc.dataUpload && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Upload: {doc.dataUpload}
          </div>
        )}
        {doc.dataValidadeLabel && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Validade: {doc.dataValidadeLabel}
          </div>
        )}
      </div>

      {/* Validade input (only for docs with expiry) */}
      {doc.temValidade && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Data de validade</label>
          <input
            type="date"
            value={doc.dataValidade ?? ""}
            onChange={(e) => onValidadeChange(doc.id, e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
      )}

      {/* Upload button */}
      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors">
        <Upload className="h-4 w-4" />
        Substituir ficheiro
      </button>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FormadorDocumentos() {
  const [docs, setDocs] = useState<MeuDocumento[]>(documentosIniciais);

  function handleValidadeChange(id: number, value: string) {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, dataValidade: value } : d))
    );
  }

  const emFalta   = docs.filter((d) => d.status === "em falta").length;
  const expirados = docs.filter((d) => d.status === "expirado").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-gray-900">Os Meus Documentos</h1>
        <p className="mt-0.5 text-sm text-gray-500">Faça upload dos documentos necessários</p>
      </div>

      {/* Alert if missing or expired */}
      {(emFalta > 0 || expirados > 0) && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            {expirados > 0 && <><span className="font-semibold">{expirados} documento{expirados > 1 ? "s" : ""} expirado{expirados > 1 ? "s" : ""}</span> — renova o mais rápido possível. </>}
            {emFalta > 0 && <><span className="font-semibold">{emFalta} documento{emFalta > 1 ? "s" : ""} em falta</span> — faz upload para completar o teu perfil.</>}
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {docs.map((doc) => (
          <DocCard
            key={doc.id}
            doc={doc}
            onValidadeChange={handleValidadeChange}
          />
        ))}
      </div>
    </div>
  );
}
