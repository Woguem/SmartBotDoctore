# Créer le dossier fruits s'il n'existe pas
New-Item -ItemType Directory -Force -Path "app/static/images/fruits"

# Liste des fruits à télécharger
$fruits = @(
    "apple",
    "banana",
    "orange",
    "strawberry",
    "grape",
    "watermelon",
    "pineapple",
    "mango"
)

# Télécharger chaque image
foreach ($fruit in $fruits) {
    $url = "https://source.unsplash.com/featured/?$fruit,fruit"
    $output = "app/static/images/fruits/$fruit.png"
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $output
        Write-Host "Téléchargé: $fruit.png"
    }
    catch {
        Write-Host "Erreur lors du téléchargement de $fruit.png"
    }
} 