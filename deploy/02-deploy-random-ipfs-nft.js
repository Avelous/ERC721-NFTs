const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const {
    storeImages,
    storeTokenUriMetadata,
} = require("../utils/uploadToPinata")

const imagesLocation = "./images/randomNft"

const metadataTemplate = {
    name: "",
    descripton: "",
    image: "",
    attributes: [
        {
            trait_types: "Cuteness",
            value: 100,
        },
    ],
}

let tokenUris = [
    "ipfs://QmRAJkVF1o2ACB3CFsN6x7SG2pZ2M7EtQCTBH1AL4pdeCw",
    "ipfs://QmSWFVUfgFChU8EKQFKJhQsFUXtvDBCbRm6VQYyAqKGQTW",
    "ipfs://QmWcz6cGBjByzZYfcZhpYiVVBpT7r2rgjGgwrSn7pQDQAr",
]

const FUND_AMOUNT = "100000000000000000000" // 10 LINK

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    let vrfCoordinatorV2Address, subscriptionId

    if (chainId == 31337 || chainId == 1337) {
        const vrfCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        )
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("====================================")

    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].mintFee,
        networkConfig[chainId].callbackGasLimit,
        tokenUris,
    ]

    const randomipfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("=======================================")

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Verifying...")
        await verify(randomipfsNft.address, args)
    }
}

async function handleTokenUris() {
    tokenUris = []
    const { responses: imageUploadResponses, files } = await storeImages(
        imagesLocation
    )

    // Uploading Metadata
    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(
            ".png",
            ""
        )
        tokenUriMetadata.descripton = `An adorable ${tokenUriMetadata.name}`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)

        const metadataUploadResponse = await storeTokenUriMetadata(
            tokenUriMetadata
        )
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }

    console.log("Token URIs Uploaded; They are:")
    console.log(tokenUris)
    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]
