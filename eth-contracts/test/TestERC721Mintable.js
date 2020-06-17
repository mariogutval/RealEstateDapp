var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new({from: account_one});

            // TODO: mint multiple tokens
            for (i = 1; i <= 10; i++) {
                if (i == 3 || i == 5) {
                    this.contract.mint(account_one, i, {from: account_one});
                }
                
                else {
                    this.contract.mint(account_two, i, {from: account_one});
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
            let tokenURI_7 = await this.contract.tokenURI(7);

            assert.equal(tokenURI_7, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/7", "Incorrect token uri.");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 5);
            let owner_5 = await this.contract.ownerOf(5);

            assert.equal(owner_5, account_two, "Transfer failed.");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let fail = false;
            try{
                await this.contract.mint(address_two, 11, {from: account_two});
            }

            catch(e) {
                fail = true;
            }

            assert.equal(fail, true, "An unauthorized address has minted a token.");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner();
            assert.equal(owner, account_one, "Incorrect contract owner.");
        })
    });
})