
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {UniswapV2Router02} from "../contracts/UniswapV2Router02.sol";
import {UniswapV2Pair} from "../contracts/UniswapV2Pair.sol";
import {ERC20_Token_Sample} from "../contracts/Token.sol";


contract testScript is Script {
     UniswapV2Router02 public router =UniswapV2Router02(payable(0x3e193F7E8d75c81E66d222C1182e63A8Db54802A));
     UniswapV2Pair public pair =UniswapV2Pair(0x114642199eEd33e1ad1699345E12ca2bB145b9E8);
     ERC20_Token_Sample public tokenA= ERC20_Token_Sample(0xaE7F6b4f2fF21fC5Fc52932A25faea11Bf5F509e);
     ERC20_Token_Sample public tokenB= ERC20_Token_Sample(0x922a36d29b1e991DB35b8e14C08828eC31E64Ac0);


    function run() public {
        vm.startBroadcast();
        
        console.log("ADDRESS: ",router.getPair(0xaE7F6b4f2fF21fC5Fc52932A25faea11Bf5F509e,0x922a36d29b1e991DB35b8e14C08828eC31E64Ac0));
        // now adding liquidity in the pair

        console.log(tokenA.balanceOf(0xa61464658AfeAf65CccaaFD3a512b69A83B77618));
        console.log(tokenB.balanceOf(0xa61464658AfeAf65CccaaFD3a512b69A83B77618));
        tokenA.approve(0x3e193F7E8d75c81E66d222C1182e63A8Db54802A, 100000);
        tokenB.approve(0x3e193F7E8d75c81E66d222C1182e63A8Db54802A, 100000);
        router.addLiquidity(0xaE7F6b4f2fF21fC5Fc52932A25faea11Bf5F509e, 0x922a36d29b1e991DB35b8e14C08828eC31E64Ac0, 1200, 3600, 100, 300,0xa61464658AfeAf65CccaaFD3a512b69A83B77618,0);
        
        (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = pair.getReserves();
        console.log("RESERVE 0: ",reserve0);
        console.log("RESERVE 1: ",reserve1);
        console.log("TIMESTAMP: ",blockTimestampLast);
        vm.stopBroadcast();
    }
}