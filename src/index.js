const xlsx = require("xlsx");
var fs = require("fs");

function convertExcelFileToJsonUsingXlsx() {
  // Read the file using pathname
  const file = xlsx.readFile(
    "/Users/peralles/Downloads/AO3.2021.Times.Produtos.Servicos (1).xlsx"
  );

  // Grab the sheet info from the file
  const sheetNames = file.SheetNames;
  const totalSheets = sheetNames.length;
  // Variable to store our data
  //let parsedData = [];
  // Loop through sheets
  for (let i = 0; i < totalSheets; i++) {
    // Convert to json using xlsx
    const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
    // Skip header row which is the colum names
    tempData.shift();

    // call a function to save the data in a json file
    generateJSONFile(tempData, sheetNames[i]);
  }
}

function generateJSONFile(data, fileName) {
  try {
    fs.writeFileSync("./generated/" + fileName + ".json", JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
}

convertExcelFileToJsonUsingXlsx();
