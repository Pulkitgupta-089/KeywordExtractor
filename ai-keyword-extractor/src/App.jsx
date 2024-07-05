import { Container, Box } from "@chakra-ui/react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Textinput from "./components/Textinput";
import { useState } from "react";
import KeywordsModal from "./components/KeywordsModal";

const App = () => {
  const [keywords, setKeywords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const extractKeywords = async (text) => {
    console.log("API Key:", import.meta.env.VITE_OPENAI_API_KEY);
    setLoading(true);
    setIsOpen(true);


    /*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */


const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
    ],
  });
   try {
    const result = await chatSession.sendMessage( "Extract keywords from this text. Make the first letter of each word uppercase and separate with commas and put # with every keyword\n\n"+text);
    console.log(result.response.text());
    // const arr=[result.response.text()];
    // console.log(arr);
   
      // console.log(result.choices[0].text.trim());
      // console.log(arr[0].trim());
      setKeywords(result.response.text());
      setLoading(false);

    
   } catch (error) {
    console.log(error);
    
   }
 
}

run();


 
  //   const options = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  //     },

  //     body: JSON.stringify({
  //       messages: [
  //         {
  //           role: "user",
  //           content:
  //             "Extract keywords from this text. Make the first letter of each word uppercase and separate with commas\n\n" +
  //             text,
  //         },
  //       ],
  //       model: "gpt-3.5-turbo",
  //     }),
  //   };

  //   try {
  //     const response = await fetch(
  //       import.meta.env.VITE_OPENAI_API_URL,
  //       options
  //     );

  //     const json = await response.json();
  //     console.log(json.choices[0].text.trim());
  //     setKeywords(json.choices[0].text.trim());
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
 };

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <Box bg="blue.600" color="white" height="100vh" paddingTop={130}>
      <Container maxW="3xl" centerContent>
        <Header />
        <Textinput extractKeywords={extractKeywords} />
        <Footer />
      </Container>
      <KeywordsModal
        keywords={keywords}
        loading={loading}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </Box>
  );
};


export default App;
