import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// DOM Elements
const formCard = document.getElementById('form-card');
const resultCard = document.getElementById('result-card');
const form = document.getElementById('visitor-form');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');

const resultWelcome = document.getElementById('result-welcome');
const resultPrayer = document.getElementById('result-prayer');

// Handle Form Submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const formData = {
    firstName: (document.getElementById('firstName') as HTMLInputElement).value,
    lastName: (document.getElementById('lastName') as HTMLInputElement).value,
    ageRange: (document.getElementById('ageRange') as HTMLSelectElement).value,
    email: (document.getElementById('email') as HTMLInputElement).value,
    address: (document.getElementById('address') as HTMLInputElement).value,
    location: (document.getElementById('location') as HTMLInputElement).value,
    membership: (document.querySelector('input[name="membership"]:checked') as HTMLInputElement).value,
    prayerRequest: (document.getElementById('prayerRequest') as HTMLTextAreaElement).value
  };

  // Update UI to loading state
  const originalBtnText = submitBtn.innerText;
  submitBtn.innerText = "Generating Personal Welcome...";
  submitBtn.setAttribute('disabled', 'true');
  submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

  try {
    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        A new visitor named ${formData.firstName} ${formData.lastName} has just filled out a connection card for our church.
        
        Details:
        - Age Group: ${formData.ageRange}
        - Location: ${formData.location}
        - Membership Interest: ${formData.membership}
        - Prayer Request: "${formData.prayerRequest}"

        Please generate a JSON response with two fields:
        1. "welcomeMessage": A warm, personalized short paragraph welcoming them to Grace Community Church. Mention their interest in membership if 'yes' or 'maybe'.
        2. "prayer": A short, specific prayer based on their prayer request. If generic, write a blessing.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            welcomeMessage: { type: Type.STRING },
            prayer: { type: Type.STRING },
          },
          required: ["welcomeMessage", "prayer"],
        },
      },
    });

    const data = JSON.parse(response.text);

    // Update Result View
    resultWelcome.innerText = data.welcomeMessage;
    resultPrayer.innerText = `"${data.prayer}"`;

    // Switch Views
    formCard.classList.add('hidden');
    resultCard.classList.remove('hidden');

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    // Reset button state
    submitBtn.innerText = originalBtnText;
    submitBtn.removeAttribute('disabled');
    submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
  }
});

// Handle Reset
resetBtn.addEventListener('click', () => {
  (form as HTMLFormElement).reset();
  resultCard.classList.add('hidden');
  formCard.classList.remove('hidden');
});
