const fastify = require("fastify")({ logger: true });
fastify.register(require('fastify-multipart'));
const service = require("./service/excel2json/index.js");

const types = ["xlsx"]
const port = process.env.PORT || 3000
fastify.get("/health", (request, reply) => { return { message: "health" } })

fastify.post("/api/upload", async (request, reply) => {
  const data = await request.file()
  const buffer = await data.toBuffer()

  fileIsvalid = fileIsValid(data, buffer)
  if (!fileIsvalid)
    return { message: "Error unsupported file" }

  var success = await service.convertExcelFileToJson(buffer)

  return success
    ?
    { message: "Success on processing file" }
    :
    { message: "Error on processing file!" }
})

function fileIsValid(data, buffer) {
  try {
    if (data == null || buffer == null) {
      console.log("File is empty")
      return false
    }

    filenameSplited = data.filename.split(".")
    fileType = filenameSplited[filenameSplited.length - 1]

    if (!types.includes(fileType)) {
      console.log("unsupported file type")
      return false
    }

    return true
  } catch (e) {
    console.error(e);
    return false
  }
}

const start = async () => {
  try {
    await fastify.listen(port, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
