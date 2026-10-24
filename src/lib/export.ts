/**
 * Excel export.
 *
 * The reports need a file Excel opens natively, so we write SpreadsheetML (the
 * Excel 2003 XML workbook format). No dependency, no server round trip, and
 * multiple named sheets per file.
 */

export type Column = {
  header: string;
  type?: "String" | "Number";
  width?: number;
};

export type Sheet = {
  name: string;
  columns: Column[];
  rows: (string | number)[][];
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const styles = `
 <Styles>
  <Style ss:ID="sHead">
   <Font ss:Bold="1" ss:Color="#FFFDF7" ss:FontName="Rubik"/>
   <Interior ss:Color="#1B3D2E" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="sText">
   <Font ss:FontName="Rubik" ss:Size="11"/>
  </Style>
  <Style ss:ID="sNum">
   <Font ss:FontName="Rubik" ss:Size="11"/>
   <NumberFormat ss:Format="#,##0.00"/>
  </Style>
 </Styles>`;

const cell = (value: string | number, type: "String" | "Number", styleId: string) => {
  if (value === "") return "<Cell/>";
  return `<Cell ss:StyleID="${styleId}"><Data ss:Type="${type}">${escapeXml(String(value))}</Data></Cell>`;
};

const worksheet = (sheet: Sheet) => {
  const header = `<Row>${sheet.columns
    .map(
      (column) =>
        `<Cell ss:StyleID="sHead"><Data ss:Type="String">${escapeXml(column.header)}</Data></Cell>`,
    )
    .join("")}</Row>`;

  const body = sheet.rows
    .map(
      (row) =>
        `<Row>${row
          .map((value, index) => {
            const type = sheet.columns[index]?.type ?? "String";
            return cell(value, type, type === "Number" ? "sNum" : "sText");
          })
          .join("")}</Row>`,
    )
    .join("");

  const columns = sheet.columns
    .map((column) => `<Column ss:Width="${column.width ?? 120}"/>`)
    .join("");

  return `<Worksheet ss:Name="${escapeXml(sheet.name).slice(0, 31)}"><Table>${columns}${header}${body}</Table></Worksheet>`;
};

export function buildWorkbook(sheets: Sheet[]) {
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
${styles}
${sheets.map(worksheet).join("\n")}
</Workbook>`;
}

export function downloadWorkbook(filename: string, sheets: Sheet[]) {
  const blob = new Blob([buildWorkbook(sheets)], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
