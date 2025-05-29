# SmartBotDoctor 🤖👨‍⚕️

SmartBotDoctor is an intelligent web application that provides personalized health recommendations using advanced AI technology. The application uses natural language processing and RAG (Retrieval-Augmented Generation) to offer safe and accurate health advice.

## Features 🌟

- Bilingual support (English/French)
- Personalized health profiles
- AI-powered natural health recommendations
- Detailed benefits and risks analysis
- Usage tips and precautions
- Responsive design for all devices

## Tech Stack 💻

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: FastAPI (Python)
- **AI/ML**: LangChain, LangSmith, RAG
- **LLM**: Groq API
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## Prerequisites 📋

- Python 3.8+
- Docker
- Groq API key

## Installation 🚀

1. Clone the repository:
```bash
git clone https://github.com/yourusername/SmartBotDoctor.git
cd SmartBotDoctor
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Groq API key
```

5. Run with Docker:
```bash
docker build -t smartbotdoctor .
docker run -p 8000:8000 smartbotdoctor
```

## Development 🛠️

1. Start the backend server:
```bash
uvicorn app.main:app --reload
```

2. Open `index.html` in your browser or use a local server for the frontend.

## Project Structure 📁

```
SmartBotDoctor/
├── app/
│   ├── main.py
│   ├── models/
│   ├── services/
│   └── utils/
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── templates/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- LangChain for AI framework
- Groq for LLM API
- FastAPI for backend framework 