import { Button, Flex, Input } from "@mantine/core";
import { chains, projectId } from "./ZeroDevWrapper";
import { useConnect } from "wagmi";
import { ZeroDevConnector } from "@zerodev/wagmi";
import { createPasskeyOwner, getPasskeyOwner, getAutocompletePasskeyOwner } from '@zerodev/sdk/passkey'
import { useEffect, useState } from "react";

function Passkey() {
  const [name, setName] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  const { connect } = useConnect()

    const handleLogin = async () => {
      setLoginLoading(true)
      const owner = await getPasskeyOwner({projectId, withCredentials: true, name})
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
      const owner = await createPasskeyOwner({name, projectId, withCredentials: true})
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
      (async () => {
        const owner = await getAutocompletePasskeyOwner({projectId})
        if (owner) {
          connect({
            connector: new ZeroDevConnector({chains, options: {
              projectId,
              owner
            }})
          })
        }
      })()
    }, [connect])

    return (
      <>
        <Input 
          type="text" 
          placeholder="Username" 
          autoComplete="username webauthn" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          onFocus={() => {
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
          }}
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