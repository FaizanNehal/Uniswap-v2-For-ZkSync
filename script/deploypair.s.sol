// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {UniswapV2Factory} from "../contracts/UniswapV2Factory.sol";


contract testScript is Script {
     UniswapV2Factory public factory =UniswapV2Factory(0x491708aC0aC935E75b3bE8281639D5165e03A8A5);

   
    function run() public {
        vm.startBroadcast();
        console.log(factory.getPair(0xaE7F6b4f2fF21fC5Fc52932A25faea11Bf5F509e, 0x922a36d29b1e991DB35b8e14C08828eC31E64Ac0));
        factory.createPair(0xaE7F6b4f2fF21fC5Fc52932A25faea11Bf5F509e, 0x922a36d29b1e991DB35b8e14C08828eC31E64Ac0);
        console.log(factory.getPair(0xaE7F6b4f2fF21fC5Fc52932A25faea11Bf5F509e, 0x922a36d29b1e991DB35b8e14C08828eC31E64Ac0));
        vm.stopBroadcast();
    }
}