// Ajoute un écouteur d'événements pour capter la touche 'Enter'
document.getElementById("search").addEventListener("keydown", function (event) {
    // Vérifie si la touche pressée est 'Enter'
    if (event.key === "Enter") {
      // Appelle la fonction de recherche
      searchEmojis();
    }
  });
  
  async function searchEmojis() {
    let searchTerm = document.getElementById("search").value.toLowerCase(); // Récupère le texte de la barre de recherche
    let gallery = document.getElementById("gallery");
    gallery.innerHTML = "🔍 Recherche en cours..."; // Affiche un message de recherche en cours
  
    try {
      // Charge les données depuis le fichier JSON
      let response = await fetch("Traduction_EN_FR/openmoji_with_translated_tags.json");
  
      // Si la réponse n'est pas "OK", cela signifie qu'il y a une erreur
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      // Convertir le contenu en JSON
      let emojis = await response.json();
  
      // Filtrer les emojis par annotation ou tags
      let results = emojis.filter(
        (emoji) =>
          emoji.annotation.toLowerCase().includes(searchTerm) ||
          emoji.tags.toLowerCase().includes(searchTerm)
      );
  
      // Afficher les résultats ou un message d'erreur
      if (results.length === 0) {
        gallery.innerHTML = "Aucun emoji trouvé.";
        return;
      }
  
      gallery.innerHTML = ""; // Réinitialise la galerie avant d'afficher les nouveaux résultats
  
      // Créer un affichage sous forme de cartes pour chaque emoji
      results.forEach((emoji) => {
        let emojiElement = document.createElement("div");
        emojiElement.classList.add("emoji");
        emojiElement.innerHTML = `
          <p><span>${emoji.emoji}</span>${emoji.annotation}</p>
          <button class="copy" onclick="copyToClipboard('${emoji.emoji}')">Copier l'emoji</button>
      `;
        gallery.appendChild(emojiElement);
      });
    } catch (error) {
      // Afficher l'erreur dans la console et afficher un message à l'utilisateur
      console.error("Erreur:", error);
      gallery.innerHTML = "❌ Erreur lors du chargement des emojis.";
    }
  }
  
// Fonction pour copier l'emoji dans le presse-papier
function copyToClipboard(emoji) {
    // Utilisation de l'API Clipboard moderne
    navigator.clipboard.writeText(emoji).then(function() {
        // Afficher un pop-up de succès avec SweetAlert2
        Swal.fire({
            position: "top-center", // Position en haut à droite
            icon: "success", // Icône de succès
            title: "Emoji copié !", // Titre du pop-up
            text: `L'emoji ${emoji} a été copié dans le presse-papier.`, // Texte supplémentaire
            showConfirmButton: false, // Masquer le bouton de confirmation
            timer: 1000, // Fermer automatiquement après 1,5 seconde
            customClass: {
                popup: 'custom-swal-popup' // Classe CSS personnalisée pour le pop-up
            }
        });
    }).catch(function(error) {
        // Afficher un pop-up d'erreur en cas de problème
        Swal.fire({
          title: 'Emoji Copié !',
          text: 'L\'emoji a été copié dans le presse-papiers.',
          icon: 'success',
          customClass: {
              popup: 'custom-swal-popup',
              title: 'custom-swal-title',
              content: 'custom-swal-content',
              confirmButton: 'custom-swal-confirm-button'
          },
          confirmButtonText: 'OK',
          buttonsStyling: false, // Désactiver les styles par défaut de SweetAlert2
      });
        console.error("Erreur lors de la copie:", error); // Log de l'erreur dans la console
    });
}
document.getElementById('socialButton').addEventListener('click', function() {
  Swal.fire({
      title: 'Connectez-vous avec moi !',
      html: `
          <div class="custom-swal-content">
              <a href="https://github.com/NoeMarchal" target="_blank">GitHub</a>
              <a href="https://www.instagram.com/noe__marchal" target="_blank">Instagram</a>
              <a href="https://fr.linkedin.com/in/no%C3%A9-marchal-21221a27b" target="_blank">LinkedIn</a>
          </div>
      `,
      customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          content: 'custom-swal-content'
      },
      showConfirmButton: false, // Pas de bouton de confirmation
      buttonsStyling: false, // Désactiver les styles par défaut de SweetAlert2
  });
});