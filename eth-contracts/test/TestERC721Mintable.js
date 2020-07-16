var ERC721MintableComplete = artifacts.require('MKN_ERC721Token');
const truffleAssert = require('truffle-assertions');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            for (i = 1; i <= 10; i++) {
                if (i == 3 || i == 5) {
                    await this.contract.mint(account_one, i, {from: account_one});
                }
                
                else {
                    await this.contract.mint(account_two, i, {from: account_one});
                }
            }
        })

        it('should return total supply', async function () { 
            let supply = await this.contract.totalSupply();
            assert.equal(supply, 10, "Incorrect number of minted tokens.");
        })

        it('should get token balance', async function () { 
            let balanceOne = await this.contract.balanceOf(account_one);
            let balanceTwo = await this.contract.balanceOf(account_two);

            assert.equal(balanceOne, 2, "Incorrect number of tokens for the first account.");
            assert.equal(balanceTwo, 8, "Incorrect number of tokens for the second account.");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURI_no1 = await this.contract.tokenURI(1);
            let tokenURI_no7 = await this.contract.tokenURI(7);

            assert.equal(tokenURI_no1, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Token URI of token number 1 has not been set correctly.");
            assert.equal(tokenURI_no7, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/7", "Token URI of token number 7 has not been set correctly.");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 3);

            let owner_token3 = await this.contract.ownerOf(3);

            assert.equal(owner_token3, account_two, "Token 3 has not been transferred correctly.");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {             
            await truffleAssert.fails(this.contract.mint(account_one, 11, {from: account_two}));
        })

        it('should return contract owner', async function () { 
            let contract_owner = await this.contract.getOwner();

            assert.equal(contract_owner, account_one, "This is not the contract owner.");
        })

    });
})