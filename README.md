# SmartBotDoctor 🤖👨‍⚕️

SmartBotDoctor is a bilingual AI-powered web application designed to provide personalized health recommendations based on user input. Leveraging a modern tech stack, the application offers a user-friendly interface and intelligent, context-aware advice.

## Features 🌟

- **Bilingual Support:** Seamless language switching between English and French for all UI elements and AI responses.
- **Personalized Recommendations:** Generates health advice based on detailed user profiles (name, age, health status, symptoms, etc.).
- **AI-Powered Insights:** Utilizes the Groq LLM via LangChain for generating natural health recommendations, including specific fruit-based treatments.
- **Interactive Chat:** Allows users to ask follow-up questions to the AI about the provided recommendations for better understanding.
- **Voice Input & Output:** Includes voice recognition for hands-free form filling and chat, and text-to-speech for listening to AI responses.
- **Responsive Design:** Adapts to various screen sizes for a consistent experience across devices.
- **Modern UI/UX:** Features a visually appealing design with a fruit-themed background, glassmorphism effects, and enhanced audio controls.

## Tech Stack 💻

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: FastAPI (Python)
- **AI/LLM**: LangChain (for orchestration), LangChain-Groq (integration), Groq API (LLM Provider - Gemma2-9B-It)
- **Data Validation**: Pydantic
- **Environment Management**: python-dotenv
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## Prerequisites 📋

- Python 3.11 (Recommended for better compatibility with current libraries)
- Docker (Optional, for containerized deployment)
- Groq API key (Required for AI functionality)

## Installation 🚀

1. Clone the repository:
```bash
git clone <repository_url>
cd SmartBotDoctor
```

2. Create a virtual environment (using Python 3.11):
```bash
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Groq API key (GROQ_API_KEY=your_key_here)
```

5. Obtain the background image:
   Download a suitable fruit background image (e.g., `fruits_background.jpg`) and place it in the `app/static/images/` directory.

6. Run the application:

   **Using Docker (Recommended for easy setup):**
   ```bash
   docker build -t smartbotdoctor .
   docker-compose up -d
   ```
   Access the application at `http://localhost:8000`.

   **Running Locally:**
   ```bash
   uvicorn app.main:app --reload
   ```
   Access the application at `http://127.0.0.1:8000`.

## Development 🛠️

To contribute or develop further:

1. Ensure you have the prerequisites installed.
2. Set up your virtual environment and install dependencies.
3. Run the backend using `uvicorn app.main:app --reload`.
4. Modify frontend files (`app/templates/index.html`, `app/static/css/styles.css`, `app/static/js/main.js`) as needed. Changes to static files and templates should be reflected upon page refresh with `--reload` enabled.

## Project Structure 📁

```
SmartBotDoctor/
├── app/
│   ├── main.py             # FastAPI application
│   ├── static/
│   │   ├── css/          # CSS files
│   │   ├── js/           # JavaScript files
│   │   └── images/       # Images (including background and logos)
│   └── templates/          # HTML templates
├── .env.example            # Example environment file
├── .dockerignore           # Files to ignore in Docker build
├── .gitignore              # Files to ignore in Git
├── Dockerfile              # Docker build instructions
├── docker-compose.yml      # Docker Compose configuration
├── requirements.txt        # Python dependencies
└── README.md               # Project documentation
```

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear messages.
4. Push your changes to your fork.
5. Open a Pull Request to the main repository.

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- LangChain and LangChain-Groq for AI framework and integration
- Groq for providing the LLM API
- FastAPI for the backend framework
- Font Awesome for icons
- Unsplash for potential royalty-free images (used for background example)

--- 