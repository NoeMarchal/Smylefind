import json
import os
from deep_translator import GoogleTranslator
from tqdm import tqdm
from time import sleep
import logging

# Configurer le système de journalisation
logging.basicConfig(filename='translation_errors.log', level=logging.ERROR, 
                    format='%(asctime)s - %(message)s')

# Fonction pour nettoyer les tags
def clean_tag(tag):
    return ''.join(char for char in tag if char.isalnum() or char.isspace())

# Fonction pour traduire un tag
def translate_tag(tag):
    try:
        return GoogleTranslator(source='en', target='fr').translate(tag)
    except Exception as e:
        logging.error(f"Erreur lors de la traduction de '{tag}': {e}")
        return tag

# Fonction pour valider les tags
def validate_tags(tags):
    valid_tags = []
    for tag in tags:
        if tag.strip():  # Ignorer les tags vides
            valid_tags.append(tag)
    return valid_tags

# Fonction principale pour traduire et ajouter les tags
def translate_and_add_tags(emoji_data):
    if "tags" in emoji_data:
        # Séparer les tags existants
        tags = emoji_data["tags"].split(", ")
        # Traduire chaque tag en français
        translated_tags = []
        for tag in tags:
            cleaned_tag = clean_tag(tag)
            translated_tag = translate_tag(cleaned_tag)
            translated_tags.append(translated_tag)
            sleep(1)  # Délai de 1 seconde entre chaque requête
        # Combiner les tags originaux et les tags traduits
        combined_tags = tags + translated_tags
        # Valider et nettoyer les tags
        combined_tags = validate_tags(combined_tags)
        # Supprimer les doublons (au cas où)
        combined_tags = list(set(combined_tags))
        # Mettre à jour la ligne "tags" avec les tags combinés
        emoji_data["tags"] = ", ".join(combined_tags)
    return emoji_data

# Charger le fichier JSON
file_path = 'Traduction_EN_FR\openmoji.json'  # Remplacez par le chemin relatif ou absolu si nécessaire
if not os.path.exists(file_path):
    print(f"Erreur : Le fichier '{file_path}' n'existe pas.")
    exit()

try:
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    print("Fichier JSON chargé avec succès!")
except Exception as e:
    print(f"Erreur lors de la lecture du fichier JSON : {e}")
    exit()

# Traduire et ajouter les tags en français pour chaque emoji
data_with_translated_tags = []
for emoji in tqdm(data, desc="Traduction des tags", unit="emoji"):
    try:
        translated_emoji = translate_and_add_tags(emoji)
        data_with_translated_tags.append(translated_emoji)
    except Exception as e:
        logging.error(f"Erreur lors du traitement d'un emoji : {e}")

# Sauvegarder les modifications dans un nouveau fichier JSON
try:
    with open('Traduction_EN_FR\openmoji_with_translated_tags.json', 'w', encoding='utf-8') as file:
        json.dump(data_with_translated_tags, file, ensure_ascii=False, indent=4)
    print("\nLes tags ont été traduits et ajoutés avec succès!")
except Exception as e:
    print(f"\nErreur lors de l'écriture du fichier JSON : {e}")