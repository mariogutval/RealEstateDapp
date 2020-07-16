pragma solidity >=0.4.21;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./Verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is MKN_ERC721Token {

    Verifier verifierContract;

    constructor(address verifierContractAddress) public {
        verifierContract = Verifier(verifierContractAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint tokenId;
        address solutionAddress;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) uniqueSolutions;


    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 tokenId, address solutioner, bytes32 solutionHash);

    // TODO Create a function to add the solutions to the array and emit the event
    // TODO Create a function to mint new MKN only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply

    function mintNewMKN(uint256 _tokenId, address _solutioner, uint[2] memory _a, uint[2][2] memory _b, uint[2] memory _c, uint[2] memory _inputs) public returns (uint) {
        require(verifierContract.verifyTx(_a, _b, _c, _inputs) == true, 'Invalid proof.');
        bytes32 solutionHash = keccak256(abi.encodePacked(_a, _b, _c, _inputs));
        require((uniqueSolutions[solutionHash].tokenId == 0) && (uniqueSolutions[solutionHash].solutionAddress == address(0)), 'Solution has been used before.');
        uniqueSolutions[solutionHash] = Solution(_tokenId, _solutioner);
        solutions.push(Solution(_tokenId, _solutioner));

        // emit SolutionLength(solutions.length);
        // emit TotalSupply(totalSupply());

        emit SolutionAdded(_tokenId, _solutioner, solutionHash);
        require(totalSupply() == solutions.length, "Total token supply does not coincide with the number of solutions.");
        mint(_solutioner, _tokenId);
        return solutions.length;
    }

    // event SolutionLength(uint);
    // event TotalSupply(uint);
}
