import Upload from "../ui/upload/upload";
import Employee from "../models/employee";
import { EmployeeRow } from "./csv-uploader.types";
import * as XLSX from "xlsx";

type LastYearSantaCsvProps = {
  onUpload: (employees: Map<string, Employee>) => void;
};

function LastYearSantaCsv({ onUpload }: LastYearSantaCsvProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<EmployeeRow>(sheet);

        // Convert the parsed data into Employee objects
        const prevEmployees = new Map<string, Employee>();
        json.forEach((row) =>
          prevEmployees.set(row.Employee_Name, {
            name: row.Employee_Name,
            email: row.Employee_EmailID,
          }),
        );
        onUpload(prevEmployees);
        console.log("employees value", prevEmployees);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Upload accept=".xlsx,.xls,.csv,.ods" handleChange={handleFileUpload} />
  );
}

export default LastYearSantaCsv;