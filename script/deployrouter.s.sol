// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {UniswapV2Router02} from "../contracts/UniswapV2Router02.sol";


contract testScript is Script {
     UniswapV2Router02 public router;

   
    function run() public {
        vm.startBroadcast();
        router = new UniswapV2Router02(0x491708aC0aC935E75b3bE8281639D5165e03A8A5,0xb4104CFeaDa272629F7Af44336a1dfa0b8dC4b30);
        vm.stopBroadcast();
    }
}