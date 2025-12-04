const ExcelJS = require("exceljs");
export const validateExcel = (value) => {
  return validRegex(
    /^(0?[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1})[-/]{1}(0?[1-9]|1[0-2]{1})[-/]{1}[12]{1}[0-9]{3}$/,
    value
  );
};

export const handleFileExcel = async (file, attributes = []) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const sheet = workbook.getWorksheet(1);
    const rowsData = [];

    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
        const object = {};
        attributes.forEach((a, index) => {
          object[a] = row.values[index + 1];
        });
        rowsData.push(object);
      }
    });
    return rowsData;
  } catch (error) {
    console.error("Error handling Excel file:", error);
    return [];
  }
};

export const handleFileExcelV2 = async (
  file,
  attributes1 = [],
  attributes2 = []
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const sheet1 = workbook.getWorksheet(1);
    const sheet2 = workbook.getWorksheet(2);
    const rowsData = [];
    const rowsData2 = [];

    sheet1.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
        const object = {};
        attributes1.forEach((a, index) => {
          object[a] = row.values[index + 1];
        });
        rowsData.push(object);
      }
    });

    sheet2.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
        const object = {};
        attributes2.forEach((a, index) => {
          object[a] = row.values[index + 1];
        });
        rowsData2.push(object);
      }
    });
    return { data1: rowsData, data2: rowsData2 };
  } catch (error) {
    console.error("Error handling Excel file:", error);
    return [];
  }
};

export const convertToExcel = (data, options = {}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  data.forEach((row) => {
    worksheet.addRow(row);
  });

  const rowWidths = options.widthCol ? {} : fitToColumn(data, options.fromRow);

  data.forEach((row, rowIndex) => {
    const excelRow = worksheet.getRow(rowIndex + 1);
    excelRow.values = row;
    if (rowIndex >= (options.fromRow || 0)) {
      excelRow.height = 24;
      excelRow.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.font = {
          name: "Times New Roman",
        };

        if (options.format && rowIndex === 0) {
          cell.font = {
            name: "Times New Roman",
            bold: true,
          };
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
          };
        }
      });
    }
  });

  let col = "A";
  for (let i = 0; i < 10; i++) {
    worksheet.getColumn(col).width = options.widthCol || rowWidths[i];
    col = String.fromCharCode(col.charCodeAt(0) + 1);
  }

  if (options.mergeCells && options.mergeCells[0]) {
    options.mergeCells.forEach((m) => worksheet.mergeCells(m));
  }
  if (options.alignments && options.alignments[0]) {
    options.alignments.forEach((a) => {
      if (typeof a === "object") {
        for (let key in a) {
          worksheet.getCell(key).alignment = a[key];
        }
      }
    });
  }
  if (options.colors && options.colors[0]) {
    options.colors.forEach((c) => {
      if (typeof c === "object") {
        for (const key in c) {
          if (Array.isArray(c[key])) {
            c[key].forEach((ck) => {
              const cell = worksheet.getCell(ck);
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: key },
              };
            });
          }
        }
      }
    });
  }
  if (options.fonts && options.fonts[0]) {
    options.fonts.forEach((a) => {
      if (typeof a === "object") {
        for (let key in a) {
          worksheet.getCell(key).font = a[key];
        }
      }
    });
  }
  if (options.outlineLevels && options.outlineLevels[0]) {
    options.outlineLevels.forEach((o) => {
      worksheet.getRow(o).outlineLevel = 1;
    });
  }
  return workbook.xlsx.writeBuffer();
};

export const fitToColumn = (arrayOfArray, fromRow = 0) => {
  const result = [];
  Object.keys(arrayOfArray[fromRow]).map((value) => {
    const item = [String(value).length];
    arrayOfArray.forEach((a, index) => {
      if (index >= fromRow && a[value]) item.push(String(a[value]).length);
    });
    result.push(Math.max(...item));
  });
  return result;
};

export const excelDateToJSDate = (excelDate) => {
  try {
    if (!excelDate) {
      return false;
    }
    if (typeof excelDate === "number") {
      return new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    } else if (typeof excelDate === "string" && validateExcel(excelDate)) {
      const c = excelDate.split("/");
      let u = [];
      for (let i = c.length - 1; i >= 0; i--) {
        u.push(c[i]);
      }
      let date = new Date(u.join("-"));
      if (isNaN(date.getTime())) {
        return false;
      }
      return date;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};
