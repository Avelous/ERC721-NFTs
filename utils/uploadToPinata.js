const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
const { Console } = require("console")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

//Upload Image File to Pinata
async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let responses = []
    console.log("Uploading to PINATA!!")
    for (fileIndex in files) {
        console.log(`Working on ${fileIndex}...`)
        const readableStreamForFile = fs.createReadStream(
            `${fullImagesPath}/${files[fileIndex]}`
        )
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile)
            responses.push(response)
        } catch (error) {
            Console.log(error)
        }
    }
    return { responses, files }
}

//Upload Image JSON metadata to Pinata
async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}

module.exports = { storeImages, storeTokenUriMetadata }
