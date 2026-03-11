"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  Download,
  Info,
  Stethoscope,
  Star,
  Zap,
  Tag,
  Users,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PreviewRow {
  row: number;
  practice_name: string;
  city: string;
  state: string;
  phone: string;
  sees_exotics: boolean;
  species: string;
  rescue_discount: boolean;
  endorsement: string;
  cost_rating: number | null;
  is_emergency: boolean;
  is_preferred: boolean;
  staff_count: number;
}

interface PreviewResult {
  rows: PreviewRow[];
  errors: string[];
  total: number;
}

interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

type Stage = "upload" | "preview" | "importing" | "done" | "error";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DRUPAL_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "http://localhost:8888";
const DRUPAL_ADMIN_USER = process.env.NEXT_PUBLIC_DRUPAL_ADMIN_USER || "admin";
const DRUPAL_ADMIN_PASS = process.env.NEXT_PUBLIC_DRUPAL_ADMIN_PASS || "admin";

function basicAuthHeader() {
  return "Basic " + btoa(`${DRUPAL_ADMIN_USER}:${DRUPAL_ADMIN_PASS}`);
}

function DollarSigns({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-gray-400 text-xs">—</span>;
  return (
    <span className="text-green-700 font-semibold text-xs">
      {"$".repeat(rating)}
      <span className="text-gray-300">{"$".repeat(5 - rating)}</span>
    </span>
  );
}

function EndorsementBadge({ level }: { level: string }) {
  if (level === "endorsed")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        <Star className="w-3 h-3" /> Endorsed
      </span>
    );
  if (level === "recommended")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
        <CheckCircle className="w-3 h-3" /> Recommended
      </span>
    );
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VetImportPage() {
  const [stage, setStage] = useState<Stage>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File selection ──────────────────────────────────────────────────────────

  function handleFileChange(f: File | null) {
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      setErrorMsg("Please select a .csv file.");
      setStage("error");
      return;
    }
    setFile(f);
    setStage("upload");
    setErrorMsg("");
  }

  // ── Preview ─────────────────────────────────────────────────────────────────

  async function handlePreview() {
    if (!file) return;
    setStage("preview");

    const formData = new FormData();
    formData.append("csv", file);

    try {
      const res = await fetch(`${DRUPAL_URL}/api/rescue/vet-import/preview`, {
        method: "POST",
        headers: { Authorization: basicAuthHeader() },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Preview failed.");
        setStage("error");
        return;
      }
      setPreview(json);
    } catch (e) {
      setErrorMsg("Could not connect to the backend. Is Drupal running?");
      setStage("error");
    }
  }

  // ── Import ──────────────────────────────────────────────────────────────────

  async function handleImport() {
    if (!file) return;
    setStage("importing");

    const formData = new FormData();
    formData.append("csv", file);

    try {
      const res = await fetch(`${DRUPAL_URL}/api/rescue/vet-import`, {
        method: "POST",
        headers: { Authorization: basicAuthHeader() },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Import failed.");
        setStage("error");
        return;
      }
      setResult(json);
      setStage("done");
    } catch (e) {
      setErrorMsg("Could not connect to the backend. Is Drupal running?");
      setStage("error");
    }
  }

  // ── Reset ───────────────────────────────────────────────────────────────────

  function reset() {
    setStage("upload");
    setFile(null);
    setPreview(null);
    setResult(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Admin
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            Import Vets from CSV
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import Vets from CSV</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Upload a CSV file to add multiple vet practices at once. Download the template below to get started.
          </p>
        </div>

        {/* Template download */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1">
            <p className="font-semibold text-teal-900 text-sm">Need the template?</p>
            <p className="text-teal-700 text-xs mt-0.5">
              Download the CSV template and fill it in. The first row of example data shows the correct format for every field.
            </p>
          </div>
          <a
            href="/vet_import_template.csv"
            download
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Download Template
          </a>
        </div>

        {/* Instructions callout */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 space-y-1">
            <p className="font-semibold">Tips for filling in the template</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-700">
              <li>The <code className="bg-blue-100 px-1 rounded">practice_name</code> column is required. All other columns are optional.</li>
              <li>Use <code className="bg-blue-100 px-1 rounded">TRUE</code> or <code className="bg-blue-100 px-1 rounded">FALSE</code> for yes/no fields.</li>
              <li>For <code className="bg-blue-100 px-1 rounded">species</code>, enter machine names separated by commas: <code className="bg-blue-100 px-1 rounded">rabbit,guinea_pig,ferret</code></li>
              <li>For <code className="bg-blue-100 px-1 rounded">endorsement</code>, use: <code className="bg-blue-100 px-1 rounded">none</code>, <code className="bg-blue-100 px-1 rounded">recommended</code>, or <code className="bg-blue-100 px-1 rounded">endorsed</code></li>
              <li>For <code className="bg-blue-100 px-1 rounded">cost_rating</code>, enter a number from 1 (cheapest) to 5 (most expensive).</li>
              <li>Add staff with columns <code className="bg-blue-100 px-1 rounded">staff_1_name</code>, <code className="bg-blue-100 px-1 rounded">staff_1_role</code>, etc. Add <code className="bg-blue-100 px-1 rounded">staff_2_*</code>, <code className="bg-blue-100 px-1 rounded">staff_3_*</code> for more.</li>
            </ul>
          </div>
        </div>

        {/* ── Stage: Upload ── */}
        {(stage === "upload" || stage === "error") && (
          <div className="space-y-4">
            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-teal-400 bg-teal-50"
                  : "border-gray-300 bg-white hover:border-teal-400 hover:bg-teal-50"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFileChange(e.dataTransfer.files[0] ?? null);
              }}
            >
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              {file ? (
                <div>
                  <p className="font-semibold text-gray-800 flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5 text-teal-600" />
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(file.size / 1024).toFixed(1)} KB — click to choose a different file
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-gray-700">Drop your CSV file here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* Error message */}
            {stage === "error" && errorMsg && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Preview button */}
            {file && (
              <button
                onClick={handlePreview}
                className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Upload and Preview
              </button>
            )}
          </div>
        )}

        {/* ── Stage: Preview ── */}
        {stage === "preview" && preview && (
          <div className="space-y-4">
            {/* Summary bar */}
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900">
                  {preview.total} vet{preview.total !== 1 ? "s" : ""} ready to import
                </p>
                {preview.errors.length > 0 && (
                  <p className="text-sm text-amber-700 mt-0.5">
                    {preview.errors.length} warning{preview.errors.length !== 1 ? "s" : ""} — see below
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Choose different file
                </button>
                <button
                  onClick={handleImport}
                  disabled={preview.total === 0}
                  className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm Import
                </button>
              </div>
            </div>

            {/* Warnings */}
            {preview.errors.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <p className="font-semibold text-amber-900 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Warnings
                </p>
                {preview.errors.map((e, i) => (
                  <p key={i} className="text-xs text-amber-800">{e}</p>
                ))}
              </div>
            )}

            {/* Preview table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Practice</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Location</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Badges</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Cost</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Staff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {preview.rows.map((row) => (
                      <tr key={row.row} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{row.practice_name}</p>
                          {row.phone && <p className="text-xs text-gray-500">{row.phone}</p>}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {[row.city, row.state].filter(Boolean).join(", ") || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {row.is_emergency && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs bg-rose-100 text-rose-800">
                                <Zap className="w-3 h-3" /> 24hr
                              </span>
                            )}
                            {row.sees_exotics && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                                Exotics
                              </span>
                            )}
                            {row.rescue_discount && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                                <Tag className="w-3 h-3" /> Discount
                              </span>
                            )}
                            <EndorsementBadge level={row.endorsement} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <DollarSigns rating={row.cost_rating} />
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {row.staff_count > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs">
                              <Users className="w-3 h-3" /> {row.staff_count}
                            </span>
                          ) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Stage: Importing ── */}
        {stage === "importing" && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-semibold text-gray-800">Importing vets…</p>
            <p className="text-sm text-gray-500 mt-1">Please wait — do not close this page.</p>
          </div>
        )}

        {/* ── Stage: Done ── */}
        {stage === "done" && result && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <CheckCircle className="w-14 h-14 text-teal-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900">Import Complete</h2>
              <div className="mt-4 flex justify-center gap-8">
                <div>
                  <p className="text-3xl font-bold text-teal-600">{result.imported}</p>
                  <p className="text-sm text-gray-500 mt-1">Vets imported</p>
                </div>
                {result.skipped > 0 && (
                  <div>
                    <p className="text-3xl font-bold text-amber-500">{result.skipped}</p>
                    <p className="text-sm text-gray-500 mt-1">Rows skipped</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-center gap-3 flex-wrap">
                <Link
                  href="/vets"
                  className="px-5 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-sm"
                >
                  View Vet Directory
                </Link>
                <button
                  onClick={reset}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Import Another File
                </button>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <p className="font-semibold text-amber-900 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> {result.errors.length} row{result.errors.length !== 1 ? "s" : ""} had issues
                </p>
                {result.errors.map((e, i) => (
                  <p key={i} className="text-xs text-amber-800">{e}</p>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
