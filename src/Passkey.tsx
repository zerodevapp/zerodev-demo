import { Button, Flex, Input } from "@mantine/core";
import { chains, projectId } from "./ZeroDevWrapper";
import { useConnect } from "wagmi";
import { ZeroDevConnector } from "@zerodev/wagmi";
import { createPasskeyOwner, getPasskeyOwner, getAutocompletePasskeyOwner, abortWebauthn } from '@zerodev/sdk/passkey'
import { useCallback, useEffect, useState } from "react";

function Passkey() {
  const [focused, setFocused] = useState(false)
  const [name, setName] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  const { connect } = useConnect()

    const handleLogin = async () => {
      setLoginLoading(true)
      const owner = await getPasskeyOwner({projectId, name})
      if (owner) {
        connect({
          connector: new ZeroDevConnector({chains, options: {
            projectId,
            owner
          }})
        })
      }
      setTimeout(() => setLoginLoading(false), 5000)
    }

    const handleRegister = async () => {
      setRegisterLoading(true)
      const owner = await createPasskeyOwner({name, projectId })
      if (owner) {
        connect({
          connector: new ZeroDevConnector({chains, options: {
            projectId,
            owner
          }})
        })
      }
      setTimeout(() => setRegisterLoading(false), 5000)
    }

    useEffect(() => {
      if (!focused) {
        getAutocompletePasskeyOwner({projectId}).then((owner) => {
          if (owner) {
            connect({
              connector: new ZeroDevConnector({chains, options: {
                projectId,
                owner
              }})
            })
          }
        })
      }
    }, [connect, focused])

    const handleFocus = useCallback(() => {
      setFocused(true)
    }, [])

    const handleBlur = useCallback(() => {
      setFocused(false)
      abortWebauthn()
    }, [])


    return (
      <>
        <Input 
          type="text" 
          placeholder="Username" 
          autoComplete="username webauthn" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <Flex gap={'lg'}>
          <Button
            loading={loginLoading}
            size={'lg'}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
            loading={registerLoading}
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
      </>
    )

}

export default Passkey