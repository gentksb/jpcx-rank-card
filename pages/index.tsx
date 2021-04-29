import Head from "next/head"
import styles from "../styles/Home.module.css"
import { Input, Heading, Button, Box, Code, Image } from "@chakra-ui/react"
import { useState } from "react"

export default function Home() {
  const [isGenerated, setIsGenerated] = useState(false)
  const [ajoccCode, setAjoccCode] = useState("")

  const buttonClickHandler = () => {
    setIsGenerated(true)
    return
  }

  const inputHandler = (event) => {
    console.log(event.target.value)
    setAjoccCode(event.target.value)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>AJOCC Ranking Card Generetor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading>AJOCC Ranking Card Generetor</Heading>
        <Box width="lg" margin="5">
          <Input placeholder="XTK-000-0000" size="lg" onChange={inputHandler} />
        </Box>
        <Box>
          <Button colorScheme="blue" onClick={buttonClickHandler}>
            生成
          </Button>
        </Box>
        {isGenerated ? (
          <>
            <Box margin={2}>
              <Image
                src={`/ajoccRankCard.png?ajoccCode=${ajoccCode}`}
                alt="your ranking card"
              />
            </Box>
            <Heading as="h3" size="md">
              URL sample
            </Heading>
            <Code>
              https://localhost:3000/ajoccRankCard.png?ajoccCode={ajoccCode}
            </Code>
          </>
        ) : (
          <></>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
