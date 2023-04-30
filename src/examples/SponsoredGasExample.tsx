import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useNetwork
} from "wagmi";
import contractAbi from "../resources/contracts/polygon-mumbai/0x34bE7f35132E97915633BC1fc020364EA5134863.json";
import { Button, Anchor, Flex } from '@mantine/core';
import { Page } from '../Page'

const description = `With ZeroDev, you can pay gas for your users, so they don't have to buy ETH before using your app.

Try minting some NFTs below, without paying gas!`

export function SponsoredGasExample({ label = undefined }) {
  const { address } = useAccount();
  const { chain } = useNetwork()

  const [balanceChanging, setBalanceChanging] = useState(false)


  const { config } = usePrepareContractWrite({
    address: "0x34bE7f35132E97915633BC1fc020364EA5134863",
    abi: contractAbi,
    functionName: "mint",
    args: [address],
    enabled: true
  });
  const { write: mint } = useContractWrite(config);

  const { data: balance = 0, refetch } = useContractRead({
    address: "0x34bE7f35132E97915633BC1fc020364EA5134863",
    abi: contractAbi,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (balance) {
      setBalanceChanging(false)
    }
  }, [balance])

  const interval = useRef<any>()

  const handleClick = useCallback(() => {
    if (mint) {
      setBalanceChanging(true)
      mint()
      interval.current = setInterval(() => {
        refetch()
      }, 1000)
      setTimeout(() => {
        if (interval.current) {
          clearInterval(interval.current)
        }
      }, 100000)
    }
  }, [mint, refetch])

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current)
    }
  }, [balance, interval]);

  return (
    <Page title={"Pay Gas for Users"} description={description} docs={"https://docs.zerodev.app/use-wallets/pay-gas-for-users"}>
      <Flex align={'center'} justify={'center'} direction={'column'} gap={'1rem'} style={{ flex: 1 }}>
        <strong style={{ fontSize: '1.5rem' }}>NFT Count</strong>
        <div style={{ fontSize: "2rem", fontWeight: 'medium', width: 100, height: 100, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '10px solid #2B8DE3' }}>{`${balance ?? 0}`}</div>
        <Button
          loading={balanceChanging}
          size={'lg'}
          onClick={handleClick}
        >
          Gas-free Mint
        </Button>
        {chain?.blockExplorers?.default.url && <Anchor href={`${chain?.blockExplorers?.default.url}/address/${address}#tokentxnsErc721`} target="_blank">Block Explorer</Anchor>}
      </Flex>
    </Page>
  );
}
