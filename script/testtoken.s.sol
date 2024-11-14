// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ERC20_Token_Sample} from "../contracts/Token.sol";

contract testScript is Script {
    ERC20_Token_Sample public counter= ERC20_Token_Sample(0xB3b570E884254131ef47eF26A01975918672Dc86);
    


    function run() public {
        vm.startBroadcast();
        console.log(counter.name());
 
        vm.stopBroadcast();
    }
}