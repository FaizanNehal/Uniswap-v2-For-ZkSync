import { BigNumber } from "ethers";
import { config } from "hardhat";
import hre from "hardhat";

import { Provider, utils, Wallet, Contract } from 'zksync-web3';
import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import EthCrypto from 'eth-crypto';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { privateKey } from "../../network_keys/secrets.json";
import fs from 'fs';
import { Address } from 'zksync-web3/build/src/types';
import { arrayify } from 'ethers/lib/utils';


const UNISWAP_ROUTER = '0x707413d632138E4a123A2BD55DbF9a46827708EB';

const TKN1_ADDRESS = '0xA92138e0F2167dc33892e101Fd10D326e2dfa52A';
const TKN2_ADDRESS = '0xDCd80599dD3911F43209cAB865114f663F0CBEC9';

const decimals = BigNumber.from(10).pow(18);


// An example of a deploy script that will deploy and call a simple contract.
async function main(){
    console.log(`Running addLiquidity for the UniswapV2Router02 contract`);

    
    const provider = new Provider(hre.config.networks.zkSyncTestnet.url);
    const wallet = new Wallet(privateKey, provider);
    const deployer = new Deployer(hre, wallet);

    const UniswapV2Router02Artifact = await deployer.loadArtifact("UniswapV2Router02");
    const UniswapV2PairArtifact = await deployer.loadArtifact("UniswapV2Pair");
    const ERC20 = await deployer.loadArtifact("ERC20");
    const WETH = await deployer.loadArtifact("WETH");

    const uniswapV2Router02 = new Contract(UNISWAP_ROUTER, UniswapV2Router02Artifact.abi, wallet)

    const tkn1 = new Contract(TKN1_ADDRESS, ERC20.abi, wallet);
    const tkn2 = new Contract(TKN2_ADDRESS, ERC20.abi, wallet);
    let wethAddress = await uniswapV2Router02.WETH();
    console.log("weth address = ", wethAddress);
    const weth = new Contract(wethAddress, WETH.abi, wallet);

    let token1_allowance_after = await tkn1.allowance(wallet.address, uniswapV2Router02.address)
    let token2_allowance_after = await tkn2.allowance(wallet.address, uniswapV2Router02.address)
    console.log("token1_allowance : " + token1_allowance_after)
    console.log("token2_allowance : " + token2_allowance_after)

    if(false){
        let pairBefore = await uniswapV2Router02.getPair(TKN1_ADDRESS, TKN2_ADDRESS);
        console.log("pairBefore: " + pairBefore);

        let txCreatePair = await uniswapV2Router02.createPair(TKN1_ADDRESS, TKN2_ADDRESS);
        console.log(txCreatePair);

        await txCreatePair.wait();

        await new Promise(r => setTimeout(r, 2000));

        let pairAfter = await uniswapV2Router02.getPair(TKN1_ADDRESS, TKN2_ADDRESS);
        console.log("pairAfter: " + pairAfter);
        let pairAfterInv = await uniswapV2Router02.getPair(TKN2_ADDRESS, TKN1_ADDRESS);
        console.log("pairAfter: " + pairAfter)

    }

    if(false){
        let pairAfter = await uniswapV2Router02.getPair(TKN1_ADDRESS, TKN2_ADDRESS);
        console.log("pairAfter: " + pairAfter);
        let pairAfterInv = await uniswapV2Router02.getPair(TKN2_ADDRESS, TKN1_ADDRESS);
        console.log("pairAfter: " + pairAfterInv);

        const pairContract = new Contract(pairAfter, UniswapV2PairArtifact.abi, wallet);

        var reservePair = await pairContract.getReserves();
        console.log("Pair reserves: ", reservePair[0].toString(), " ",  reservePair[1].toString(), " ", reservePair[2].toString());


        // var reserve1 = await uniswapV2Router02.getReserves(TKN1_ADDRESS, TKN2_ADDRESS);
        // console.log(reserve1[0].toString(), " - ", reserve1[1].toString());

        // var reserve2 = await uniswapV2Router02.getReserves(TKN1_ADDRESS, TKN2_ADDRESS);
        // console.log(reserve2[0].toString(), " - ", reserve2[1].toString());



        let amountIn = BigNumber.from(10).mul(decimals);
        let path = [TKN2_ADDRESS,TKN1_ADDRESS];
        let res = await uniswapV2Router02.getAmountsOut(amountIn, path);
        console.log("amountOut = ",res.toString());

    }


    if(true){
        console.log("addLiquidity");
    /** function addLiquidity(
            address tokenA,
            address tokenB,
            uint amountADesired,
            uint amountBDesired,
            uint amountAMin,
            uint amountBMin,
            address to,
            uint deadline
        ) external virtual override ensure(deadline) returns (uint amountA, uint amountB, uint liquidity) {
    */

        let tokenA = TKN1_ADDRESS // TKN1
        let tokenB = TKN2_ADDRESS // TKN2
        let amountADesired = BigNumber.from(100000).mul(decimals); // 1M TKN1
        let amountBDesired = BigNumber.from(100000).mul(decimals); // 1M TKN2
        let amountAMin = '0'
        let amountBMin = '0'
        let to = wallet.address;
        let deadline = Math.round((new Date()).getTime()/1000)+86400;

        const tx = await uniswapV2Router02.addLiquidity(
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            to,
            deadline
        )
        console.log(tx);
        await tx.wait();
        let pairAddr = await uniswapV2Router02.getPair(TKN1_ADDRESS, TKN2_ADDRESS);
        console.log("pairAddr = ",pairAddr);

    }

    if(true){
        console.log("removeLiquidity");
    /** removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    */
        let pairAddr = await uniswapV2Router02.getPair(TKN1_ADDRESS, TKN2_ADDRESS);
        let pairContract = new Contract(pairAddr, UniswapV2PairArtifact.abi, wallet);

        let liquidity = await pairContract.balanceOf(wallet.address);
        console.log("liquidity before ",liquidity.toString());
        let balanceBefore1 = await tkn1.balanceOf(pairAddr);
        let balanceBefore2 = await tkn2.balanceOf(pairAddr);
        console.log("Pair Balance 1: ", balanceBefore1.div(decimals).toString());
        console.log("Pair Balance 2: ", balanceBefore2.div(decimals).toString());

        let tokenA = TKN1_ADDRESS // TKN1
        let tokenB = TKN2_ADDRESS // TKN2
        let amountAmin = BigNumber.from(0).mul(decimals); // 1M TKN1
        let amountBmin = BigNumber.from(0).mul(decimals); // 1M TKN2

        let to = wallet.address;
        let deadline = Math.round((new Date()).getTime()/1000)+86400;

        let liquidityToRemove = liquidity.div(4);

        const approveTx = await pairContract.approve(uniswapV2Router02.address,liquidityToRemove);
        await approveTx.wait();

        const tx = await uniswapV2Router02.removeLiquidity(
            tokenA,
            tokenB,
            liquidityToRemove,
            amountAmin,
            amountBmin,
            to,
            deadline
        )
        console.log(tx);
        await tx.wait();

        let liquidityAfter = await pairContract.balanceOf(wallet.address);
        console.log("liquidityAfter before ",liquidityAfter.toString());

        let balanceafter1 = await tkn1.balanceOf(pairAddr);
        let balanceafter2 = await tkn2.balanceOf(pairAddr);
        console.log("Pair Balance 1: ", balanceafter1.div(decimals).toString());
        console.log("Pair Balance 2: ", balanceafter2.div(decimals).toString());
    }


    {
        let pairAddr = await uniswapV2Router02.getPair(TKN1_ADDRESS, TKN2_ADDRESS);
        console.log("pairAddress: " + pairAddr);
        let balanceBefore1 = await tkn1.balanceOf(pairAddr);
        let balanceBefore2 = await tkn2.balanceOf(pairAddr);
        console.log("Pair Balance 1: ", balanceBefore1.div(decimals).toString());
        console.log("Pair Balance 2: ", balanceBefore2.div(decimals).toString());
    }
    
  

    if(true){
        console.log("swapExactTokensForTokens");
        /**
         *  function swapExactTokensForTokens(
            uint amountIn,
            uint amountOutMin,
            address[] calldata path,
            address to,
            uint deadline
        */

        let amountIn = BigNumber.from(10).mul(decimals);
        let amountOutMin = BigNumber.from(0).mul(decimals);
        let path = [TKN2_ADDRESS,TKN1_ADDRESS];
        let to = wallet.address;
        let deadline = Math.round((new Date()).getTime()/1000)+86400;

        let balanceBefore1 = await tkn1.balanceOf(wallet.address);
        let balanceBefore2 = await tkn2.balanceOf(wallet.address);
        console.log("Balance 1: ", balanceBefore1.div(decimals).toString());
        console.log("Balance 2: ", balanceBefore2.div(decimals).toString());

        const swapTx = await uniswapV2Router02.swapExactTokensForTokens(amountIn,amountOutMin,path,to,deadline);

        console.log("swapTx",swapTx);
        await swapTx.wait();

        let balanceAfter1 = await tkn1.balanceOf(wallet.address);
        let balanceAfter2 = await tkn2.balanceOf(wallet.address);
        console.log("Balance 1: ", balanceAfter1.div(decimals).toString());
        console.log("Balance 2: ", balanceAfter2.div(decimals).toString());
    }

    if(true){
        console.log("swapTokensForExactTokens");
        /** 
         *  function swapTokensForExactTokens(
            uint amountOut,
            uint amountInMax,
            address[] calldata path,
            address to,
            uint deadline
        */

        let amountOut = BigNumber.from(10).mul(decimals);
        let amountInMax = BigNumber.from(100).mul(decimals);
        let path = [TKN2_ADDRESS,TKN1_ADDRESS];
        let to = wallet.address;
        let deadline = Math.round((new Date()).getTime()/1000)+86400;

        let balanceBefore1 = await tkn1.balanceOf(wallet.address);
        let balanceBefore2 = await tkn2.balanceOf(wallet.address);
        console.log("Balance 1: ", balanceBefore1.div(decimals).toString());
        console.log("Balance 2: ", balanceBefore2.div(decimals).toString());

        const swapTx = await uniswapV2Router02.swapTokensForExactTokens(amountOut,amountInMax,path,to,deadline);

        console.log("swapTx",swapTx);
        await swapTx.wait();

        let balanceAfter1 = await tkn1.balanceOf(wallet.address);
        let balanceAfter2 = await tkn2.balanceOf(wallet.address);
        console.log("Balance 1: ", balanceAfter1.div(decimals).toString());
        console.log("Balance 2: ", balanceAfter2.div(decimals).toString());
    }


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });