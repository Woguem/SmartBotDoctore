document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('healthForm');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const chatContainer = document.getElementById('chat-container');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    let currentLanguage = 'fr';
    let recognition = null;
    let synthesis = window.speechSynthesis;
    let isRecording = false;
    let currentUtterance = null;

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
    }

    // Voice input function
    function toggleVoiceInput(targetElement, startButton, stopButton) {
        if (!recognition) {
            alert(currentLanguage === 'fr' 
                ? 'La reconnaissance vocale n\'est pas supportée sur votre navigateur.'
                : 'Speech recognition is not supported in your browser.');
            return;
        }

        if (!isRecording) {
            // Start recording
            isRecording = true;
            startButton.style.display = 'none';
            stopButton.style.display = 'flex';
            stopButton.classList.add('recording');
            recognition.lang = currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
            
            recognition.onresult = function(event) {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                targetElement.value = transcript;
            };

            recognition.onerror = function(event) {
                console.error('Speech recognition error:', event.error);
                stopRecording(startButton, stopButton);
            };

            recognition.start();
        } else {
            // Stop recording
            stopRecording(startButton, stopButton);
        }
    }

    function stopRecording(startButton, stopButton) {
        isRecording = false;
        startButton.style.display = 'flex';
        stopButton.style.display = 'none';
        stopButton.classList.remove('recording');
        if (recognition) {
            recognition.stop();
        }
    }

    // Text-to-speech function with voice selection
    function speakText(text, button = null) {
        if (synthesis) {
            // Cancel any ongoing speech
            synthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            
            // Get available voices
            const voices = synthesis.getVoices();
            
            // Select appropriate voice based on language
            if (currentLanguage === 'fr') {
                const frenchVoice = voices.find(voice => 
                    voice.lang.includes('fr') && voice.name.includes('French'));
                if (frenchVoice) utterance.voice = frenchVoice;
            } else {
                const englishVoice = voices.find(voice => 
                    voice.lang.includes('en') && voice.name.includes('English'));
                if (englishVoice) utterance.voice = englishVoice;
            }

            // Set other properties
            utterance.lang = currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            // Update button state if provided
            if (button) {
                button.innerHTML = '<i class="fas fa-stop"></i>';
                button.classList.add('playing');
            }

            utterance.onend = function() {
                if (button) {
                    button.innerHTML = '<i class="fas fa-play"></i>';
                    button.classList.remove('playing');
                }
            };

            currentUtterance = utterance;
            synthesis.speak(utterance);
        }
    }

    function toggleSpeech(button, text) {
        if (button.classList.contains('playing')) {
            synthesis.cancel();
            button.innerHTML = '<i class="fas fa-play"></i>';
            button.classList.remove('playing');
        } else {
            speakText(text, button);
        }
    }

    // Add voice input buttons
    const voiceControls = {
        'name': { start: 'nameStart', stop: 'nameStop' },
        'age': { start: 'ageStart', stop: 'ageStop' },
        'healthStatus': { start: 'healthStatusStart', stop: 'healthStatusStop' },
        'symptoms': { start: 'symptomsStart', stop: 'symptomsStop' },
        'allergies': { start: 'allergiesStart', stop: 'allergiesStop' },
        'chat': { start: 'chatStart', stop: 'chatStop' }
    };

    Object.entries(voiceControls).forEach(([field, buttons]) => {
        const startButton = document.getElementById(buttons.start);
        const stopButton = document.getElementById(buttons.stop);
        const targetElement = document.getElementById(field === 'chat' ? 'chat-input' : field);

        if (startButton && stopButton && targetElement) {
            startButton.addEventListener('click', () => toggleVoiceInput(targetElement, startButton, stopButton));
            stopButton.addEventListener('click', () => stopRecording(startButton, stopButton));
        }
    });

    // Add speech buttons to messages
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const textDiv = document.createElement('div');
        textDiv.textContent = text;
        messageDiv.appendChild(textDiv);

        const speechButton = document.createElement('button');
        speechButton.classList.add('speech-btn');
        speechButton.innerHTML = '<i class="fas fa-play"></i>';
        speechButton.addEventListener('click', () => toggleSpeech(speechButton, text));
        messageDiv.appendChild(speechButton);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Load voices when available
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = function() {
            const voices = synthesis.getVoices();
            console.log('Available voices:', voices);
        };
    }

    // Language switcher
    function switchLanguage(lang) {
        currentLanguage = lang;
        
        // Update all elements with data-fr and data-en attributes
        document.querySelectorAll('[data-fr], [data-en]').forEach(element => {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                const placeholder = element.getAttribute(`data-${lang}-placeholder`);
                if (placeholder) {
                    element.placeholder = placeholder;
                }
            } else {
                const text = element.getAttribute(`data-${lang}`);
                if (text) {
                    element.textContent = text;
                }
            }
        });

        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Update chat input placeholder
        chatInput.placeholder = lang === 'fr' 
            ? 'Posez votre question ici...'
            : 'Ask your question here...';

        // Update error message if visible
        if (error.style.display === 'block') {
            error.textContent = lang === 'fr'
                ? 'Veuillez remplir tous les champs obligatoires.'
                : 'Please fill in all required fields.';
        }
    }

    // Add click event listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const healthStatus = document.getElementById('healthStatus').value;
        const symptoms = document.getElementById('symptoms').value;

        if (!name || !age || !healthStatus || !symptoms) {
            error.style.display = 'block';
            error.textContent = currentLanguage === 'fr' 
                ? 'Veuillez remplir tous les champs obligatoires.'
                : 'Please fill in all required fields.';
            return;
        }

        // Show loading
        loading.style.display = 'block';
        error.style.display = 'none';
        chatContainer.style.display = 'none';
        chatMessages.innerHTML = ''; // Clear previous chat
        
        const formData = {
            name: name,
            age: parseInt(age),
            health_status: healthStatus,
            symptoms: symptoms,
            is_pregnant: document.getElementById('is_pregnant').checked,
            is_diabetic: document.getElementById('is_diabetic').checked,
            allergies: document.getElementById('allergies').value,
            language: currentLanguage
        };

        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Network response was not ok');
            }

            const data = await response.json();
            
            // Hide loading and show chat
            loading.style.display = 'none';
            chatContainer.style.display = 'block';
            
            // Add bot's initial message
            addMessage(data.recommendation, 'bot');
            speakText(data.recommendation);
            
            // Add a follow-up message
            const followUpMessage = currentLanguage === 'fr'
                ? "Vous pouvez me poser des questions sur ces recommandations. Je suis là pour vous aider à mieux comprendre."
                : "You can ask me questions about these recommendations. I'm here to help you better understand.";
            addMessage(followUpMessage, 'bot');
            speakText(followUpMessage);
            
        } catch (err) {
            loading.style.display = 'none';
            error.style.display = 'block';
            error.textContent = currentLanguage === 'fr' 
                ? `Une erreur est survenue : ${err.message}. Veuillez réessayer.`
                : `An error occurred: ${err.message}. Please try again.`;
        }
    });

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, 'user');
        chatInput.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    language: currentLanguage,
                    context: chatMessages.textContent
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Network response was not ok');
            }

            const data = await response.json();
            addMessage(data.response, 'bot');
            speakText(data.response);
            
        } catch (err) {
            const errorMessage = currentLanguage === 'fr'
                ? `Désolé, une erreur est survenue : ${err.message}. Veuillez réessayer.`
                : `Sorry, an error occurred: ${err.message}. Please try again.`;
            addMessage(errorMessage, 'bot');
            speakText(errorMessage);
        }
    }

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Initialize language
    switchLanguage('fr');
}); 