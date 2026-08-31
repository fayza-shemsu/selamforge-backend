"use client";

import { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { FileUp, Upload } from "lucide-react";
import type {
  EmployeeImportRow,
  ImportError,
  ImportResult
} from "@/lib/types/import";

const requiredFields: Array<keyof EmployeeImportRow> = [
  "first_name",
  "last_name",
  "email",
  "hire_date",
  "base_salary_etb",
  "org_unit_id"
];

function missingFields(row: EmployeeImportRow) {
  return requiredFields.filter((field) => !row[field]?.trim());
}

export function EmployeeCsvImport() {
  const [rows, setRows] = useState<EmployeeImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);

  const previewRows = rows.slice(0, 8);
  const clientErrors = useMemo<ImportError[]>(
    () =>
      rows.flatMap((row, index) =>
        missingFields(row).map((field) => ({
          row: index + 2,
          field,
          message: "Required field is blank."
        }))
      ),
    [rows]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: false,
    onDrop: ([file]) => {
      if (!file) {
        return;
      }

      setFileName(file.name);
      setResult(null);
      Papa.parse<EmployeeImportRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (parsed) => setRows(parsed.data)
      });
    }
  });

  async function upload() {
    const simulatedErrors = clientErrors.slice(0, 5);
    setResult({
      created: Math.max(0, rows.length - simulatedErrors.length),
      errors: simulatedErrors
    });
  }

  return (
    <div className="space-y-5">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-5 py-8 text-center transition ${
          isDragActive
            ? "border-brand-500 bg-brand-50"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <input {...getInputProps()} />
        <FileUp aria-hidden="true" size={28} className="text-brand-600" />
        <p className="mt-3 text-sm font-medium text-ink">
          {fileName || "Drop employee CSV here"}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Preview appears before upload so bad rows can be caught early.
        </p>
      </div>

      {rows.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-md border border-slate-200">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Row</th>
                  {requiredFields.map((field) => (
                    <th key={field} className="px-3 py-2">
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {previewRows.map((row, index) => {
                  const missing = missingFields(row);

                  return (
                    <tr key={`${row.email}-${index}`} className="bg-white">
                      <td className="px-3 py-2 text-slate-500">{index + 2}</td>
                      {requiredFields.map((field) => (
                        <td
                          key={field}
                          className={`px-3 py-2 ${
                            missing.includes(field)
                              ? "bg-red-50 text-red-700"
                              : "text-slate-700"
                          }`}
                        >
                          {row[field] || "Missing"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              {rows.length} rows parsed, {clientErrors.length} obvious issues.
            </p>
            <button
              type="button"
              onClick={upload}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <Upload aria-hidden="true" size={16} />
              Upload CSV
            </button>
          </div>
        </>
      ) : null}

      {result ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="font-medium text-ink">{result.created} employees created</p>
          {result.errors.length > 0 ? (
            <div className="mt-3 overflow-hidden rounded-md border border-slate-200">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Row</th>
                    <th className="px-3 py-2">Field</th>
                    <th className="px-3 py-2">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {result.errors.map((error) => (
                    <tr key={`${error.row}-${error.field}`} className="bg-white">
                      <td className="px-3 py-2">{error.row}</td>
                      <td className="px-3 py-2">{error.field}</td>
                      <td className="px-3 py-2 text-red-700">{error.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
