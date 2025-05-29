import requests
import os

# Liste des fruits à télécharger
fruits = [
    'apple',
    'banana',
    'orange',
    'strawberry',
    'grape',
    'watermelon',
    'pineapple',
    'mango'
]

# Créer le dossier s'il n'existe pas
os.makedirs('app/static/images/fruits', exist_ok=True)

# Télécharger chaque image
for fruit in fruits:
    # URL de l'API Unsplash pour obtenir une image aléatoire
    url = f'https://source.unsplash.com/featured/?{fruit},fruit'
    
    # Télécharger l'image
    response = requests.get(url)
    
    if response.status_code == 200:
        # Sauvegarder l'image
        with open(f'app/static/images/fruits/{fruit}.png', 'wb') as f:
            f.write(response.content)
        print(f'Téléchargé: {fruit}.png')
    else:
        print(f'Erreur lors du téléchargement de {fruit}.png') 