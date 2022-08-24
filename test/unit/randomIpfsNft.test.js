// We are going to skimp a bit on these tests...

const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const {
    developmentChains,
    networkConfig,
} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random IPFS NFT Unit Tests", async function () {
          let randomIpfsNft, deployer, vrfCoordinatorV2Mock

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "randomipfs"])
              randomIpfsNft = await ethers.getContract("RandomIpfsNft")
              vrfCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock"
              )
          })

          describe("constructor", () => {
              it("sets starting values correctly", async function () {
                  const dogTokenUriZero = await randomIpfsNft.getDogTokenUris(0)
                  const isInitialized = await randomIpfsNft.getInitialized()
                  assert(dogTokenUriZero.includes("ipfs://"))
                  assert.equal(isInitialized, true)
              })
          })

          describe("requestNft", () => {
              it("fails if payment isn't sent with the request", async function () {
                  await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
                      "NeedMoreETHSent"
                  )
              })
              it("emits an event and kicks off a random word request", async function () {
                  const fee = await randomIpfsNft.getMintFee()
                  await expect(
                      randomIpfsNft.requestNft({ value: fee.toString() })
                  ).to.emit(randomIpfsNft, "NftRequested")
              })
          })
          describe("fulfillRandomWords", () => {
              it("mints NFT after random number is returned", async function () {
                  await new Promise(async (resolve, reject) => {
                      randomIpfsNft.once("NftMinted", async () => {
                          try {
                              const tokenUri = await randomIpfsNft.tokenURI("0")
                              const tokenCounter =
                                  await randomIpfsNft.getTokenCounter()
                              assert.equal(
                                  tokenUri.toString().includes("ipfs://"),
                                  true
                              )
                              assert.equal(tokenCounter.toString(), "1")
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })
                      try {
                          const fee = await randomIpfsNft.getMintFee()
                          const requestNftResponse =
                              await randomIpfsNft.requestNft({
                                  value: fee.toString(),
                              })
                          const requestNftReceipt =
                              await requestNftResponse.wait(1)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestNftReceipt.events[1].args.requestId,
                              randomIpfsNft.address
                          )
                      } catch (e) {
                          console.log(e)
                          reject(e)
                      }
                  })
              })
          })

          describe("Withdraw", () => {
              it("Withdraw Eth", async function () {
                  const startingNftBalance =
                      await randomIpfsNft.provider.getBalance(
                          randomIpfsNft.address
                      )
                  const startingDeployerBalance =
                      await randomIpfsNft.provider.getBalance(deployer.address)
                  const fee = await randomIpfsNft.getMintFee()
                  const transactionResponse1 = await randomIpfsNft.requestNft({
                      value: fee.toString(),
                  })
                  const transactionReceipt1 = await transactionResponse1.wait(1)
                  const {
                      gasUsed: gasUsed1,
                      effectiveGasPrice: effectiveGasPrice1,
                  } = transactionReceipt1
                  const gasCost1 = gasUsed1.mul(effectiveGasPrice1)

                  const transactionResponse2 = await randomIpfsNft.withdraw()
                  const transactionReceipt2 = await transactionResponse2.wait(1)
                  const {
                      gasUsed: gasUsed2,
                      effectiveGasPrice: effectiveGasPrice2,
                  } = transactionReceipt2
                  const gasCost2 = gasUsed2.mul(effectiveGasPrice2)

                  const endingNftBalance =
                      await randomIpfsNft.provider.getBalance(
                          randomIpfsNft.address
                      )
                  const endingDeployerBalance =
                      await randomIpfsNft.provider.getBalance(deployer.address)

                  assert.equal(endingNftBalance, 0)
                  assert.equal(
                      startingNftBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance
                          .add(gasCost1)
                          .add(gasCost2)
                          .toString()
                  )
              })
          })

          describe("getBreedFromModdedRng", () => {
              it("fails if Modded Rng is above range", async function () {
                  await expect(
                      randomIpfsNft.getBreedFromModdedRng(101)
                  ).to.be.revertedWith("RangeOutOfBounds")
              })
          })
      })
