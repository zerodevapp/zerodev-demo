import { Button, Flex } from "@mantine/core";
import { getWebAuthnAssertion } from "@turnkey/http/dist/webauthn";
import { chains, defaultProjectId } from "./ZeroDevWrapper";
import { SmartAccountSigner } from "@alchemy/aa-core";
import { useConnect } from "wagmi";
import { ZeroDevConnector } from "@zerodevapp/wagmi";
//@ts-expect-error
import { createPasskeyOwner, getPasskeyOwner } from '@zerodevapp/sdk/passkey'



function Passkey() {
  const { connect } = useConnect()

    const handleRegister = async (name: string) => {
      connect({
        connector: new ZeroDevConnector({chains, options: {
          projectId: defaultProjectId,
          owner: await createPasskeyOwner({name: 'ZeroDev', projectId: defaultProjectId})
        }})
      })
    }

    const handleLogin = async () => {
        connect({
          connector: new ZeroDevConnector({chains, options: {
            projectId: defaultProjectId,
            owner: await getPasskeyOwner({projectId: defaultProjectId})
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
            onClick={() => handleRegister('Test 2')}
            variant={'outline'}
          >
            Register
          </Button>
        </Flex>
    )

}

export default Passkey