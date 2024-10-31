// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {UniswapV2Factory} from "../contracts/UniswapV2Factory.sol";


contract testScript is Script {
     UniswapV2Factory public factory;

   
    function run() public {
        vm.startBroadcast();
        factory = new UniswapV2Factory(0xa61464658AfeAf65CccaaFD3a512b69A83B77618);
        vm.stopBroadcast();
    }
}