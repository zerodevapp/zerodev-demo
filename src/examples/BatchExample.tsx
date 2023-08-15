import { useCallback, useEffect, useRef, useState } from "react";
import {
  useAccount,
  useContractRead,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import contractAbi from "../resources/contracts/polygon-mumbai/0x34bE7f35132E97915633BC1fc020364EA5134863.json";
import { Button, Anchor, Flex } from '@mantine/core';
import { Page } from "../Page";
import { usePrepareContractBatchWrite, useContractBatchWrite } from "@zerodev/wagmi";

const nftAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863'

const description = `With ZeroDev, you can execute multiple transactions as a single transaction, so you get to save on confirmation time and gas cost. It's also safer because these transactions either all execute or all revert, no in-between, which is a property known as "atomicity."

In this example, we will be sending two "Mint" transactions in one.`

export function BatchExample() {
  const { address } = useAccount();
  const { chain } = useNetwork()

  const [balanceChanging, setBalanceChanging] = useState(false)

  const { config } = usePrepareContractBatchWrite({
      calls: [
        {
          address: nftAddress,
          abi: contractAbi,
          functionName: "mint",
          args: [address],
        }, {
          address: nftAddress,
          abi: contractAbi,
          functionName: "mint",
          args: [address],
        }
    ],
    enabled: true
  },
  )

  const { sendUserOperation: batchMint, data } = useContractBatchWrite(config) 

  useWaitForTransaction({
    hash: data?.hash,
    enabled: !!data,
    onSuccess() {
      console.log("Transaction was successful.")
    }
  })

  const { data: balance = 0, refetch } = useContractRead({
    address: nftAddress,
    abi: contractAbi,
    functionName: "balanceOf",
    args: [address],
  });

  const interval = useRef<any>()
  const handleClick = useCallback(() => {
    if (batchMint) {
      setBalanceChanging(true)
      batchMint()
      interval.current = setInterval(() => {
        refetch()
      }, 1000)
      setTimeout(() => {
        if (interval.current) {
          clearInterval(interval.current)
        }
      }, 100000)
    }
  }, [batchMint, refetch])

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current)
    }
  }, [balance, interval]);

  useEffect(() => {
    if (balance) setBalanceChanging(false)

  }, [balance])

  return (
    <Page title={"Bundle Transactions"} description={description} docs={"https://docs.zerodev.app/use-wallets/batch-transactions"}>
      <Flex align={'center'} justify={'center'} mih={'100%'} direction={'column'} gap={'1rem'}>
        <strong style={{ fontSize: '1.5rem' }}>NFT Count</strong>
        <div style={{ fontSize: "2rem", fontWeight: 'medium', width: 100, height: 100, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '10px solid #2B8DE3' }}>{`${balance ?? 0}`}</div>
        <Button
          loading={balanceChanging}
          size={'lg'}
          onClick={handleClick}
        >
          Mint Twice
        </Button>
        {chain?.blockExplorers?.default.url && <Anchor href={`${chain?.blockExplorers?.default.url}/address/${address}#tokentxnsErc721`} target="_blank">Block Explorer</Anchor>}
      </Flex>
    </Page>
  );
}
