# NFT Repo


<img src="https://user-images.githubusercontent.com/86206128/182033510-61d003a3-6d9d-44db-9dbf-4a6f635d1e30.png" width="150" height="150"> <img src="https://user-images.githubusercontent.com/86206128/182033513-fa83df1d-8958-47f9-8ebe-5501f6c430d1.png" width="150" height="150"> <img src="https://user-images.githubusercontent.com/86206128/182033518-8b58af07-f374-42ca-967f-a983324fc9cb.png" width="150" height="150"> <img src="https://user-images.githubusercontent.com/86206128/182033556-a1f3bdab-41a5-4d14-9453-86c71472d01a.svg" width="150" height="150">  <img src="https://user-images.githubusercontent.com/86206128/182033559-b8ce669b-89f7-44e4-a4a8-5d653994a9b5.svg" width="150" height="150">


Repo goes through the creation of three different kinds of NFTs.


1. Basic NFT
2. Random IPFS Hosted NFT
    NFTs are generated randomly based on rarity
3. Dynamic SVG NFT
    Nfts changes conditionally

- **Basic Nft** Contract involves just the deployment of one NFT. Image is hosted off-chain on IPFS

- **Random IPFS Hosted NFTs** involves the deployment of three nfts, a pub, a shiba inu and a st bernard image. Each has different rarities.  Chainlink VRF handles the randomness. Images and URIs are hosted on Pinata.

- **Dynamic SVG NFTs** are just two Nfts that interchange based on a condition. The condition is checked using Chainlink Price Feeds. Images and the URIS are hosted on-chain in their SVG base64 form. 


## Getting Started

### Requirements

1. [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. [Nodejs](https://nodejs.org/en/)
3. [Yarn](https://yarnpkg.com/getting-started/install) or npm

### Technologies Used

1. [Hardhat](https://hardhat.org/)
2. [Pinata](https://pinata.cloud/) Hosting
3. [IPFS](https://ipfs.io/) Hosting
3. [Chainlink VRF](https://vrf.chain.link/)
4. [Chainlink Feeds](https://docs.chain.link/docs/get-the-latest-price/)
5. [OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/erc721) ERC721
6. [Alchemy](https://alchemy.com)


### Breakdown

Each kind of NFT has its own:
1. Smart contracts written in solidity
2. Deploy Scripts
3. Unit Test Scripts
4. Verify Script
5. Mint Script

Other Scripts include:
- Mocks deploy script
- Image Hosting on Pinata Script



## Thank you!
Feel free to follow me
<a href="https://twitter.com/Av3lous"><img src="https://user-images.githubusercontent.com/86206128/182034124-9de8fc5b-0f4a-48b6-9a37-c2e2a0c9f8e8.svg" width="100" height="30"></a> <a href="https://www.linkedin.com/in/avelous"><img src="https://user-images.githubusercontent.com/86206128/182034127-826b3d79-4904-41e0-8897-e418973be00c.svg" width="100" height="30"></a>