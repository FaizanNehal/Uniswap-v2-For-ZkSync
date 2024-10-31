// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {UniswapV2Pair} from "../contracts/UniswapV2Pair.sol";


contract testScript is Script {
     UniswapV2Pair public pair =UniswapV2Pair(0x114642199eEd33e1ad1699345E12ca2bB145b9E8);

   
    function run() public {
        vm.startBroadcast();

        
        (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = pair.getReserves();
        console.log("RESERVE 0: ",reserve0);
        console.log("RESERVE 1: ",reserve1);
        console.log("TIMESTAMP: ",blockTimestampLast);
        vm.stopBroadcast();
    }
}