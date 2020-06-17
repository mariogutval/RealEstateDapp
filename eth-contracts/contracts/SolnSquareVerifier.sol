pragma solidity >=0.4.21;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./verifier.sol";
contract verifier is Verifier{}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {

    verifier verifierContract;

    constructor(address verifierContractAddress) public {
        verifierContract = verifier(verifierContractAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint index;
        address solutionAddress;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => address) uniqueSolutions;


    // TODO Create an event to emit when a solution is added
    event SolutionAdded(address solutioner);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint _index, address _solutioner) public {
        solutions.push(Solution(_index, _solutioner));
        emit SolutionAdded(_solutioner);
    }



    // TODO Create a function to mint new MKN only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuply

    function mintNewMKN(address _address, uint256 _id, uint[2] memory _a, uint[2][2] memory _b, uint[2] memory _c, uint[2] memory _input) public returns (bool) {
        require(verifierContract.verifyTx(_a, _b, _c, _input), "solution is not valid");
        bytes32 solutionHash = keccak256(abi.encodePacked(_a, _b, _c, _input));
        require(uniqueSolutions[solutionHash] == address(0), "The solution has already been used.");
        uniqueSolutions[solutionHash] = _address;
        addSolution(_id, _address);
        return mint(_address, _id);
    }
}