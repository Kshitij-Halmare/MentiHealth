// import { Router } from "express";
// import { HfInference } from "@huggingface/inference";
// import { ChangePassword, CheckOtp, getScore, RegisterUser, resetOtp, verifyEmail } from "../Components/RegisterUser.js";
// import VerifyEmail from "../Components/VerifyEmail.js";
// import { Login } from "../Components/RegisterUser.js";
// import { Logout } from "../Components/RegisterUser.js";
// import auth from "../middleware/UserAuth.js";
// import upload from "../middleware/multer.js";
// import uploadImageCloudinary from "../utils/uploadImage.js";
// import ChatModel from "../Schemas/ChatSchema.js";
// // Create a client with Hugging Face API token

// const client = new HfInference(process.env.HfInference_data);

// const userRouter = Router();

// // POST route for user registration
// userRouter.post('/register', upload.single('avatar'), RegisterUser);

// // POST route for user login
// userRouter.post("/login", Login);

// // GET route for user logout
// userRouter.get("/logout", auth, Logout);

// userRouter.post("/checkOtp",CheckOtp);

// userRouter.post("/verify-email",verifyEmail);

// userRouter.post("/resendOtp",resetOtp);
// userRouter.post("/getScore",getScore);
// userRouter.post("/changePassword",ChangePassword);

// userRouter.post("/talk", async (req, res) => {
//   const { data, userId } = req.body;
//   // console.log(req.body);

//   const input = data;

//   // Check if the input message is present
//   if (!input) {
//     return res.status(400).json({ error: "Input message is required" });
//   }

//   try {
//     // Step 1: Fetch the last summarized conversation for the user
//     const lastChat = await ChatModel.findOne({ userId }).sort({ createdAt: -1 }).limit(1);
    
//     let previousSummary = "";
//     let interactionCount = 0; // Count the number of interactions
//     let cumulativeScore = 0; // Sum of all mental health scores

//     // If there's a previous chat summary, use it as context and get existing scores
//     if (lastChat) {
//       previousSummary = lastChat.mentalHealthInsights;
//       interactionCount = lastChat.interactionCount || 0; // Get the number of interactions
//       cumulativeScore = lastChat.cumulativeScore || 0; // Get the cumulative score
//     }

//     // Combine the previous summary with the new input data
//     const combinedInput = `${previousSummary} ${input}`;
//     // console.log("Combined input:", combinedInput);

//     // Step 2: Make the API request to Hugging Face to get the AI response
//     const chatCompletion = await client.chatCompletion({
//       model: "mistralai/Mistral-Nemo-Instruct-2407",
//       messages: [
//         {
//           role: "user",
//           content: `Assume that you are a best friend of mine and this is our ongoing conversation. Previously, I shared with you: "${previousSummary}". Now, I am saying: "${input}". Based on that, as a good friend and counselor, talk to me with emotion and sympathy. Ask a few questions to keep the conversation going based on previous history.`,
//         },
//       ],
//       max_tokens: 500,
//     });

//     const aiResponse = chatCompletion.choices[0].message.content;
//     // console.log("AI Response:", aiResponse);

//     // Send the AI response immediately to the client
//     res.json({ message: aiResponse });

//     // Step 3: Prepare the combined text for summarization
//     const summarizationInput = `${combinedInput} ${aiResponse}`;
//     // console.log("Summarization input:", summarizationInput);

//     // Step 4: Use the summarization model to summarize the conversation
//     const summarization = await client.summarization({
//       model: "facebook/bart-large-cnn",  // You can change this model as needed
//       inputs: summarizationInput,
//       parameters: {
//         max_length: 150,
//         min_length: 50,
//         do_sample: false,
//       },
//     });

//     const summarizedText = summarization.summary_text;
//     // console.log("Summarized Text:", summarizedText);

//     // Step 5: Now use Hugging Face's sentiment analysis model via client
//     const sentimentAnalysis = await fetch("https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.HfInference_data}`, // Replace with your API key
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ inputs: summarizedText }),
//     });
    
//     const sentimentResult = await sentimentAnalysis.json();
//     // console.log("Sentiment Analysis Result:", sentimentResult);

//     // Determine the mental health score based on sentiment result
//     let mentalHealthScore = 0;

    
//     if (sentimentResult[0][0].label === "POSITIVE") {
//       mentalHealthScore = Math.floor(sentimentResult[0][0].score * 100);
//     } else if (sentimentResult[0][0].label === "NEGATIVE") {
//       mentalHealthScore = Math.floor((1 - sentimentResult[0][0].score) * 100);
//     }
    
//     // console.log("Mental Health Score:", mentalHealthScore);

//     // Update cumulative score and interaction count
//     interactionCount += 1;
//     cumulativeScore += mentalHealthScore;

//     // Calculate the average mental health score
//     const averageMentalHealthScore = cumulativeScore / interactionCount;
//     // console.log("Average Mental Health Score:", averageMentalHealthScore);

//     // Step 6: Update the existing chat or store the new summarized conversation and score
//     if (lastChat) {
//       // Update the existing chat record
//       lastChat.mentalHealthInsights = summarizedText;
//       lastChat.mentalHealthScore = averageMentalHealthScore;
//       lastChat.interactionCount = interactionCount;
//       lastChat.cumulativeScore = cumulativeScore;
//       await lastChat.save();
//     } else {
//       // Create a new chat record
//       const newChat = new ChatModel({
//         userId: userId,
//         mentalHealthInsights: summarizedText,
//         mentalHealthScore: averageMentalHealthScore, // Store the average score
//         interactionCount: interactionCount,  // Store the number of interactions
//         cumulativeScore: cumulativeScore,    // Store the cumulative score
//       });
//       await newChat.save();
//     }

//     // console.log("Background processing completed for user:", userId);
//   } catch (error) {
//     console.error("Error during background processing:", error);
//   }
// })


// export default userRouter;
import { Router } from "express";
import { HfInference } from "@huggingface/inference";
import {
  ChangePassword,
  CheckOtp,
  getScore,
  RegisterUser,
  resetOtp,
  verifyEmail,
  Login,
  Logout,
} from "../Components/RegisterUser.js";
import auth from "../middleware/UserAuth.js";
import upload from "../middleware/multer.js";
import uploadImageCloudinary from "../utils/uploadImage.js";
import ChatModel from "../Schemas/ChatSchema.js";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Create a client with Hugging Face API token
const client = new HfInference(process.env.HfInference_data);

const userRouter = Router();

// POST route for user registration
userRouter.post('/register', upload.single('avatar'), RegisterUser);

// POST route for user login
userRouter.post("/login", Login);

// GET route for user logout
userRouter.get("/logout", auth, Logout);

// Other routes
userRouter.post("/checkOtp", CheckOtp);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resendOtp", resetOtp);
userRouter.post("/getScore", getScore);
userRouter.post("/changePassword", ChangePassword);

userRouter.post("/talk", async (req, res) => {
  const { data, userId } = req.body;

  console.log("[INFO] /talk endpoint called");
  console.log("[INFO] Request body:", { data, userId });
    console.log("[DEBUG] Hugging Face token starts with:", process.env.HfInference_data?.slice(0, 10));


  if (!data) {
    console.warn("[WARN] No input message received");
    return res.status(400).json({ error: "Input message is required" });
  }

  try {
    console.log("[STEP 1] Fetching last chat from DB...");
    const lastChat = await ChatModel.findOne({ userId }).sort({ createdAt: -1 }).limit(1);

    let previousSummary = lastChat ? lastChat.mentalHealthInsights : "";
    let interactionCount = lastChat?.interactionCount || 0;
    let cumulativeScore = lastChat?.cumulativeScore || 0;

    console.log("[INFO] Last chat fetched:", { previousSummary, interactionCount, cumulativeScore });

    const combinedInput = `${previousSummary} ${data}`;
    console.log("[STEP 2] Combined input prepared:", combinedInput);

    console.log("[STEP 3] Sending request to Hugging Face chatCompletion...");

    // Test model with a fallback in case Nemo is restricted
    let chatCompletion;
    // try {
    //   chatCompletion = await client.chatCompletion({
    //     model: "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-0528-Qwen3-8B", // or use "mistralai/Mistral-7B-Instruct-v0.2" if this fails
    //     messages: [
    //       {
    //         role: "user",
    //         content: `Assume you're my best friend. Previously: "${previousSummary}". Now: "${data}". Respond empathetically.`,
    //       },
    //     ],
    //     max_tokens: 500,
    //   });
    // } catch (apiError) {
    //   console.error("[ERROR] Hugging Face chatCompletion failed:", apiError);
    //   return res.status(500).json({ error: "Failed to fetch AI response from Hugging Face" });
    // }
    chatCompletion = await client.chatCompletion({
  endpointUrl: "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
  messages: [
    { role: "user", content: "Explain quantum computing in simple words" }
  ],
  max_tokens: 300,
  temperature: 0.6,
});

// console.log(response.choices[0].message);
      
    if (!chatCompletion || !chatCompletion.choices || !chatCompletion.choices[0]) {
      console.error("[ERROR] Invalid chatCompletion response:", chatCompletion);
      return res.status(500).json({ error: "Invalid AI response from Hugging Face" });
    }

    const aiResponse = chatCompletion.choices[0].message.content;
    console.log("[INFO] AI response received:", aiResponse);

    console.log("[STEP 4] Sending response back to client...");
    res.json({ message: aiResponse });

    console.log("[STEP 5] Starting summarization...");
    const summarization = await client.summarization({
      model: "facebook/bart-large-cnn",
      inputs: `${combinedInput} ${aiResponse}`,
      parameters: { max_length: 150, min_length: 50, do_sample: false },
    });

    const summarizedText = summarization.summary_text || "";
    console.log("[INFO] Summarization result:", summarizedText);

    console.log("[STEP 6] Performing sentiment analysis...");
    const sentimentAnalysisResponse = await fetch(
      "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HfInference_data}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: summarizedText }),
      }
    );

    const sentimentResult = await sentimentAnalysisResponse.json();
    console.log("[INFO] Sentiment analysis result:", sentimentResult);

    let mentalHealthScore = 0;
    if (sentimentResult?.[0]?.[0]?.label === "POSITIVE") {
      mentalHealthScore = Math.floor(sentimentResult[0][0].score * 100);
    } else if (sentimentResult?.[0]?.[0]?.label === "NEGATIVE") {
      mentalHealthScore = Math.floor((1 - sentimentResult[0][0].score) * 100);
    }
    console.log("[INFO] Calculated mental health score:", mentalHealthScore);

    interactionCount += 1;
    cumulativeScore += mentalHealthScore;
    const averageMentalHealthScore = cumulativeScore / interactionCount;

    console.log("[INFO] Updated interaction count:", interactionCount);
    console.log("[INFO] Updated cumulative score:", cumulativeScore);
    console.log("[INFO] Average mental health score:", averageMentalHealthScore);

    console.log("[STEP 7] Saving chat data to DB...");
    if (lastChat) {
      lastChat.mentalHealthInsights = summarizedText;
      lastChat.mentalHealthScore = averageMentalHealthScore;
      lastChat.interactionCount = interactionCount;
      lastChat.cumulativeScore = cumulativeScore;
      await lastChat.save();
      console.log("[INFO] Existing chat updated successfully");
    } else {
      const newChat = new ChatModel({
        userId,
        mentalHealthInsights: summarizedText,
        mentalHealthScore: averageMentalHealthScore,
        interactionCount,
        cumulativeScore,
      });
      await newChat.save();
      console.log("[INFO] New chat created successfully");
    }

    console.log("[SUCCESS] /talk route executed successfully");
  } catch (error) {
    console.error("[ERROR] Error in /talk route:", error);
    res.status(500).json({ error: "An error occurred while processing the chat." });
  }
});



export default userRouter;
