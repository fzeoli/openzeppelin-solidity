// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "../access/AccessControl.sol";
import "@nomiclabs/buidler/console.sol";

contract AccessControlMock is AccessControl {
    constructor() public {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function setRoleAdmin(bytes32 roleId, bytes32 adminRoleId) public {
        _setRoleAdmin(roleId, adminRoleId);
    }
}
