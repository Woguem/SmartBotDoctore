from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Optional
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

os.environ["GROQ_API_KEY"]=os.getenv("GROQ_API_KEY")

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Templates
templates = Jinja2Templates(directory="app/templates")

# Initialize Groq LLM
llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="gemma2-9b-it"
)

# Create the health recommendation prompt template
health_system_template = """You are a helpful health assistant. Provide personalized health recommendations based on the user's input.
Consider their name, age, health status, symptoms, pregnancy status, diabetes status, allergies, and language preference.
Be clear, concise, and professional in your response.
Always start your response with a friendly greeting using the person's name.
If the user's input is in French, respond in French. If in English, respond in English.

Format your response in a clear, structured way with numbered points (1., 2., 3., etc.):

1. Greeting and Situation Summary
   - Friendly greeting using the person's name
   - Brief overview of the health situation
   - Key factors to consider

2. Specific Recommendations
   - List of specific actions to take
   - Lifestyle modifications if needed

3. Fruit-Based Treatments
   - List of recommended fruits for the condition
   - Detailed explanation of health benefits for each fruit
   - How to consume these fruits (raw, juice, smoothie, etc.)
   - Precautions or contraindications if any

4. Important Precautions
   - List of precautions to take
   - Warning signs to watch for

5. When to Seek Medical Attention
   - Clear indicators for when to consult a healthcare professional
   - Emergency signs if any

Do not use asterisks (*) or bullet points (-) in your response. Use only numbered points and sub-points.
Keep the language consistent with the user's input language (French or English)."""

health_human_template = """Name: {name}
Age: {age}
Health Status: {health_status}
Symptoms: {symptoms}
Pregnant: {is_pregnant}
Diabetic: {is_diabetic}
Allergies: {allergies}
Language: {language}"""

health_system_message = SystemMessagePromptTemplate.from_template(health_system_template)
health_human_message = HumanMessagePromptTemplate.from_template(health_human_template)
health_chat_prompt = ChatPromptTemplate.from_messages([health_system_message, health_human_message])

# Create the chat prompt template
chat_system_template = """You are a helpful health assistant. Answer questions about health recommendations and provide additional information when needed.
Be clear, concise, and professional in your response.
Always maintain a friendly and supportive tone.
If the user's input is in French, respond in French. If in English, respond in English.
Always maintain a supportive and informative tone.
If you're not sure about something, say so and suggest consulting a healthcare professional."""

chat_human_template = """Previous Context: {context}
User Question: {message}
Language: {language}"""

chat_system_message = SystemMessagePromptTemplate.from_template(chat_system_template)
chat_human_message = HumanMessagePromptTemplate.from_template(chat_human_template)
chat_prompt = ChatPromptTemplate.from_messages([chat_system_message, chat_human_message])

# Create the LLM chains
health_chain = LLMChain(llm=llm, prompt=health_chat_prompt)
chat_chain = LLMChain(llm=llm, prompt=chat_prompt)

class HealthInput(BaseModel):
    name: str
    age: int
    health_status: str
    symptoms: str
    is_pregnant: bool
    is_diabetic: bool
    allergies: Optional[str] = ""
    language: str

class ChatInput(BaseModel):
    message: str
    language: str
    context: Optional[str] = ""

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/recommendations")
async def get_recommendations(input_data: HealthInput):
    try:
        # Validate input
        if input_data.age < 0 or input_data.age > 120:
            raise HTTPException(
                status_code=400,
                detail="Age must be between 0 and 120"
            )

        if not input_data.health_status.strip() or not input_data.symptoms.strip():
            raise HTTPException(
                status_code=400,
                detail="Health status and symptoms are required"
            )

        result = health_chain.invoke({
            "name": input_data.name,
            "age": input_data.age,
            "health_status": input_data.health_status,
            "symptoms": input_data.symptoms,
            "is_pregnant": input_data.is_pregnant,
            "is_diabetic": input_data.is_diabetic,
            "allergies": input_data.allergies,
            "language": input_data.language
        })
        
        return {"recommendation": result["text"]}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendations: {str(e)}"
        )

@app.post("/api/chat")
async def chat(input_data: ChatInput):
    try:
        if not input_data.message.strip():
            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty"
            )

        result = chat_chain.invoke({
            "message": input_data.message,
            "language": input_data.language,
            "context": input_data.context
        })
        
        return {"response": result["text"]}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating chat response: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 