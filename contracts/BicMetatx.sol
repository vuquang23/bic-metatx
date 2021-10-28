//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import {SafeMath} from  "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./metatx/NativeMetaTransaction.sol";
import "./metatx/ContextMixin.sol";

contract BicMetatx is AccessControlEnumerable, Pausable, NativeMetaTransaction,   {
    using SafeMath for uint256;

    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    address public admin;
    address public bicAddress;

    constructor(address _admin, address _bicAddress) {
        admin = _admin;
        bicAddress = _bicAddress;
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(TRANSFER_ROLE, admin);
        _setupRole(PAUSER_ROLE, admin);

    }

    modifier onlyRelayer() {
        require(_msgSender() == address(this), "Must be relayer to call function");
        _;
    }

    function pause() public {
        require(hasRole(PAUSER_ROLE, _msgSender()), "Must have pauser role to pause");
        _pause();
    }

    function unpause() public {
        require(hasRole(PAUSER_ROLE, _msgSender()), "Must have pauser role to pause");
        _unpause();
    }

    function changeBicAddress(address _newBicAddress) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Must have admin role to change bic address");
        bicAddress = _newBicAddress;
    }

    function transferTo(address _to, uint256 _amount) public onlyRelayer {
        address freeSender = msgSender();
        (bool success, bytes memory data) = address(bicAddress).call(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", freeSender, _to, _amount)
        );
        require(success, "Failed to transfer by relayer");
    }

    function executeMetaTransaction(
        address userAddress,
        bytes memory functionSignature,
        bytes32 sigR,
        bytes32 sigS,
        uint8 sigV
    ) public override virtual payable returns (bytes memory) {
        require(hasRole(TRANSFER_ROLE, _msgSender()), "Must have tranfer role to exec meta tx");
        return super.executeMetaTransaction(userAddress, functionSignature, sigR, sigS, sigV);
    }
}
