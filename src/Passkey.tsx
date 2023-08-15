import { Button, Flex } from "@mantine/core";
import { chains, projectId } from "./ZeroDevWrapper";
import { useConnect } from "wagmi";
import { ZeroDevConnector } from "@zerodev/wagmi";
import { createPasskeyOwner, getPasskeyOwner, getOrCreatePasskeyOwner } from '@zerodev/sdk/passkey'



function Passkey() {
  const { connect } = useConnect()

    const handleEnter = async () => {
      connect({
        connector: new ZeroDevConnector({chains, options: {
          projectId,
          owner: await getOrCreatePasskeyOwner({name: 'ZeroDev', projectId})
        }})
      })
    }

    const handleLogin = async () => {
        connect({
          connector: new ZeroDevConnector({chains, options: {
            projectId,
            owner: await getPasskeyOwner({projectId})
          }})
        })
    }

    const handleRegister = async () => {
      connect({
        connector: new ZeroDevConnector({chains, options: {
          projectId,
          owner: await createPasskeyOwner({name: 'ZeroDev', projectId})
        }})
      })
    }
    

    return (
        <Flex gap={'lg'}>
          <Button
            loading={false}
            size={'lg'}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
            loading={false}
            size={'lg'}
            onClick={handleRegister}
            variant={'outline'}
          >
            Register
          </Button>
          {/* <Button
            loading={false}
            size={'lg'}
            onClick={handleEnter}
          >
            Enter
          </Button> */}
        </Flex>
    )

}

export default Passkey