// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ERC20_Token_Sample} from "../contracts/Token.sol";
import {UniswapV2Pair} from "../contracts/UniswapV2Pair.sol";
import {UniswapV2Router02} from "../contracts/UniswapV2Router02.sol";

contract testScript is Script {
    ERC20_Token_Sample public tokenA= ERC20_Token_Sample(0xaE7F6b4f2fF21fC5Fc52932A25faea11Bf5F509e);
    ERC20_Token_Sample public tokenB= ERC20_Token_Sample(0x922a36d29b1e991DB35b8e14C08828eC31E64Ac0);

    UniswapV2Router02 public router =UniswapV2Router02(payable(0x3e193F7E8d75c81E66d222C1182e63A8Db54802A));
    UniswapV2Pair public pair =UniswapV2Pair(0x114642199eEd33e1ad1699345E12ca2bB145b9E8);
    
    function run() public {
        vm.startBroadcast();
        (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = pair.getReserves();
        console.log("BEFORE SWAP");
        console.log("RESERVE of ERC20 Token Sample1: ",reserve0);
        console.log("RESERVE of ERC20 Token Sample2: ",reserve1);
        console.log("TIMESTAMP: ",blockTimestampLast);
     //   console.log("TOKEN A BEFORE SWAP: ",tokenA.balanceOf(msg.sender));
     //   console.log("TOKEN B BEFORE SWAP: ",tokenB.balanceOf(msg.sender));

     //   counter.transfer(0x0D43eB5B8a47bA8900d84AA36656c92024e9772e, 10000);

        tokenA.approve(address(router), 500);
    //    address[] calldata paths= [0xaE7F6b4f2fF21fC5Fc52932A25faea11Bf5F509e, 0x922a36d29b1e991DB35b8e14C08828eC31E64Ac0];
     //   paths[0]=0xaE7F6b4f2fF21fC5Fc52932A25faea11Bf5F509e;
    //    paths[1]=0x922a36d29b1e991DB35b8e14C08828eC31E64Ac0;
        address[] memory paths = new address[](2);
        paths[0]=address(0xaE7F6b4f2fF21fC5Fc52932A25faea11Bf5F509e);
        paths[1]=address(0x922a36d29b1e991DB35b8e14C08828eC31E64Ac0);
        router.swapExactTokensForTokens(200, 0, paths, 0x0D43eB5B8a47bA8900d84AA36656c92024e9772e, block.timestamp+400);

       // console.log("TOKEN A AFTER SWAP: ",tokenA.balanceOf(msg.sender));
       // console.log("TOKEN B AFTER SWAP: ",tokenB.balanceOf(msg.sender));

        (reserve0, reserve1, blockTimestampLast) = pair.getReserves();
        console.log("");
        console.log("AFTER SWAP");
        console.log("RESERVE ERC20 Token Sample1: ",reserve0);
        console.log("RESERVE ERC20 Token Sample2: ",reserve1);
        console.log("TIMESTAMP: ",blockTimestampLast);

        //pair.swap(100, 100, 0x0D43eB5B8a47bA8900d84AA36656c92024e9772e, data);
        vm.stopBroadcast();
    }
}