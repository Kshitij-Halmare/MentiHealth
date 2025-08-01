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

// Background processing function
// async function processInBackground(userId, combinedInput, aiResponse, lastChat) {
//   try {
//     // Run summarization and sentiment analysis in parallel
//     const [summarization, sentimentResult] = await Promise.all([
//       client.summarization({
//         model: "facebook/bart-large-cnn",
//         inputs: `${combinedInput} ${aiResponse}`,
//         parameters: { max_length: 150, min_length: 50, do_sample: false },
//       }),
//       fetch(
//         "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${process.env.HfInference_data}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ inputs: `${combinedInput} ${aiResponse}` }),
//         }
//       ).then(res => res.json())
//     ]);

//     const summarizedText = summarization.summary_text;
//     let mentalHealthScore = 0;

//     if (sentimentResult[0][0].label === "POSITIVE") {
//       mentalHealthScore = Math.floor(sentimentResult[0][0].score * 100);
//     } else if (sentimentResult[0][0].label === "NEGATIVE") {
//       mentalHealthScore = Math.floor((1 - sentimentResult[0][0].score) * 100);
//     }

//     const interactionCount = (lastChat?.interactionCount || 0) + 1;
//     const cumulativeScore = (lastChat?.cumulativeScore || 0) + mentalHealthScore;
//     const averageMentalHealthScore = cumulativeScore / interactionCount;

//     if (lastChat) {
//       await ChatModel.findByIdAndUpdate(lastChat._id, {
//         mentalHealthInsights: summarizedText,
//         mentalHealthScore: averageMentalHealthScore,
//         interactionCount,
//         cumulativeScore,
//       });
//     } else {
//       const newChat = new ChatModel({
//         userId,
//         mentalHealthInsights: summarizedText,
//         mentalHealthScore: averageMentalHealthScore,
//         interactionCount,
//         cumulativeScore,
//       });
//       await newChat.save();
//     }
//   } catch (error) {
//     console.error("Background processing error:", error);
//     // Consider implementing a retry mechanism or dead letter queue here
//   }
// }

// userRouter.post("/talk", async (req, res) => {
//   const { data, userId } = req.body;

//   if (!data) {
//     return res.status(400).json({ error: "Input message is required" });
//   }

//   try {
//     // Get last chat data (with minimal fields for better performance)
//     const lastChat = await ChatModel.findOne({ userId })
//       .select('mentalHealthInsights interactionCount cumulativeScore')
//       .sort({ createdAt: -1 })
//       .limit(1)
//       .lean(); // Use lean() for better performance since we're only reading

//     const previousSummary = lastChat?.mentalHealthInsights || "";
//     const combinedInput = `${previousSummary} ${data}`;

//     // Get AI response first
//     const chatCompletion = await client.chatCompletion({
//       model: "mistralai/Mistral-Nemo-Instruct-2407",
//       messages: [
//         {
//           role: "user",
//           content: `Assume you're my best friend. Previously: "${previousSummary}". Now: "${data}". Respond empathetically.`,
//         },
//       ],
//       max_tokens: 500,
//     });

//     const aiResponse = chatCompletion.choices[0].message.content;

//     // Respond immediately to user
//     res.json({ message: aiResponse });

//     // Process background tasks asynchronously (don't await)
//     setImmediate(() => {
//       processInBackground(userId, combinedInput, aiResponse, lastChat);
//     });

//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "An error occurred while processing the chat." });
//   }
// });

// Background processing function
async function processInBackground(userId, combinedInput, aiResponse, lastChat) {
  try {
    // Run summarization and sentiment analysis in parallel
    const [summarization, sentimentResult] = await Promise.all([
      client.summarization({
        model: "facebook/bart-large-cnn",
        inputs: `${combinedInput} ${aiResponse}`,
        parameters: { max_length: 150, min_length: 50, do_sample: false },
      }),
      fetch(
        "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_INFERENCE_API_KEY}`, // ✅ Fixed env variable
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: `${combinedInput} ${aiResponse}` }),
        }
      ).then(res => res.json())
    ]);

    // ✅ Fixed summarization response
    const summarizedText = Array.isArray(summarization) ? summarization[0]?.summary_text || "" : summarization.summary_text;

    // ✅ Safe sentiment check
    const sentiment = sentimentResult?.[0]?.[0];
    let mentalHealthScore = 0;
    if (sentiment?.label === "POSITIVE") {
      mentalHealthScore = Math.floor(sentiment.score * 100);
    } else if (sentiment?.label === "NEGATIVE") {
      mentalHealthScore = Math.floor((1 - sentiment.score) * 100);
    }

    // Calculate updated scores
    const interactionCount = (lastChat?.interactionCount || 0) + 1;
    const cumulativeScore = (lastChat?.cumulativeScore || 0) + mentalHealthScore;
    const averageMentalHealthScore = cumulativeScore / interactionCount;

    // Save chat insights
    if (lastChat) {
      await ChatModel.findByIdAndUpdate(lastChat._id, {
        mentalHealthInsights: summarizedText,
        mentalHealthScore: averageMentalHealthScore,
        interactionCount,
        cumulativeScore,
      });
    } else {
      const newChat = new ChatModel({
        userId,
        mentalHealthInsights: summarizedText,
        mentalHealthScore: averageMentalHealthScore,
        interactionCount,
        cumulativeScore,
      });
      await newChat.save();
    }
  } catch (error) {
    console.error("Background processing error:", error.response?.data || error.message);
  }
}

// Main chat route
userRouter.post("/talk", async (req, res) => {
  const { data, userId } = req.body;

  if (!data) {
    return res.status(400).json({ error: "Input message is required" });
  }

  try {
    // Get last chat data (only minimal fields for performance)
    const lastChat = await ChatModel.findOne({ userId })
      .select("mentalHealthInsights interactionCount cumulativeScore")
      .sort({ createdAt: -1 })
      .lean();

    const previousSummary = lastChat?.mentalHealthInsights || "";
    const combinedInput = `${previousSummary} ${data}`;

    // Get AI response
    const chatCompletion = await client.chatCompletion({
      model: "mistralai/Mistral-Nemo-Instruct-2407",
      messages: [
        {
          role: "user",
          content: `Assume you're my best friend. Previously: "${previousSummary}". Now: "${data}". Respond empathetically.`,
        },
      ],
      max_tokens: 500,
    });

    const aiResponse = chatCompletion.choices[0].message.content;

    // Send immediate response to user
    res.json({ message: aiResponse });

    // Background processing (async, no await)
    setImmediate(() => {
      processInBackground(userId, combinedInput, aiResponse, lastChat);
    });

  } catch (error) {
    console.error("Error in /talk route:", error.response?.data || error.message);
    res.status(500).json({ error: "An error occurred while processing the chat." });
  }
});


// Alternative approach using a queue system (if you have Redis available)
/*
const Queue = require('bull');
const processQueue = new Queue('chat processing');

processQueue.process(async (job) => {
  const { userId, combinedInput, aiResponse, lastChat } = job.data;
  await processInBackground(userId, combinedInput, aiResponse, lastChat);
});

// In your main route, replace setImmediate with:
processQueue.add('process-chat', {
  userId,
  combinedInput,
  aiResponse,
  lastChat
});
*/

export default userRouter;
