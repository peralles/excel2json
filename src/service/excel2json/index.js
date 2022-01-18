const xlsx = require("xlsx");
var fs = require("fs");
const mongo_client = require("mongodb").MongoClient;
global.mongo = global.mongo || {};

const uri = process.env.MONGODB_URI || "mongodb+srv://excel2json:KJ!EIWJ22@cluster0.as4ke.mongodb.net/teste?retryWrites=true&w=majority&readPreference=primary";


async function convertExcelFileToJson(fileStream) {
    try {
        // Read the file using stream
        const file = xlsx.read(fileStream, { type: "buffer" });
        await readXlsxAndConvert2Json(file);

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}


async function readXlsxAndConvert2Json(xlsxFile) {
    // Grab the sheet info from the file
    const sheetNames = xlsxFile.SheetNames;
    const totalSheets = sheetNames.length;

    // Loop through sheets
    for (let i = 0; i < totalSheets; i++) {
        // Convert to json using xlsx
        const tempData = xlsx.utils.sheet_to_json(xlsxFile.Sheets[sheetNames[i]]);
        // Skip header row which is the colum names
        tempData.shift();

        // call a function to save the data in a json file
        await saveOnMongoDb(tempData, sheetNames[i])
    }
}

async function saveOnMongoDb(data, fileName) {
    try {
        global.mongo.client = await getMongoClient();
        const database = global.mongo.client.db("excel2json");
        const options = { ordered: true };
        const collection = database.collection(fileName);
        const result = await collection.insertMany(data, options)
    } catch (err) {
        console.error(err);
    }
    finally {
        await global.mongo.client.close();
    }
}

async function getMongoClient() {
    if (!global.mongo.client) {
        global.mongo.client = new mongo_client(uri);
    }
    await global.mongo.client.connect();
    return global.mongo.client;
}

module.exports.convertExcelFileToJson = convertExcelFileToJson;
