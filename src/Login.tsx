import { createStyles, Title, Text, Container, Flex } from '@mantine/core';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ReactComponent as ZeroDevLogo } from './resources/assets/images/logo.svg';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',

    '@media (max-width: 755px)': {
      paddingTop: 80,
      paddingBottom: 60,
    },
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 28,
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
  },
}));

export function Login() {
  const { classes } = useStyles();

  return (
    <Container h={'100vh'}>
      <Flex justify={"center"} align="center" mih={'100%'} direction={'column'} gap={30}>
        <ZeroDevLogo width={300} height={'100%'} />
        <Title className={classes.title}>
          Supercharge Web3 UX with<br />
          <Text component="span" className={classes.highlight} inherit>
            Account Abstraction
          </Text>
        </Title>
        <ConnectButton label={"Start Demo"} />
        ZeroDev will create an AA wallet for you using social accounts.
      </Flex>
    </Container>
  );
}