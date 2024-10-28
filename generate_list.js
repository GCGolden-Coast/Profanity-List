const fs = require('fs');

// Funktion zum Generieren der Wortvariationen
function generateVariations(word) {
    const variations = new Set();
    variations.add(word.toLowerCase());
    variations.add(word.toUpperCase());
    variations.add(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

    // Hinzufügen von zufälligen Zeichen
    const additionalCharacters = ['-', '_', '!', '?', '@', '#'];
    for (let char of additionalCharacters) {
        variations.add(char + word);
        variations.add(word + char);
        variations.add(word.replace(/([aeiou])/g, `$1${char}`)); // Vokale betonen
    }

    return Array.from(variations);
}

// Funktion zum Generieren des Regex
function generateRegex(variations) {
    const regexParts = variations.map(variation => {
        return `(?:${variation.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&')})`;
    });
    return regexParts.join('|');
}

// Hauptfunktion
function main() {
    fs.readFile('words.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Fehler beim Lesen der Datei:', err);
            return;
        }

        const words = data.split(/\r?\n/).filter(word => word.trim() !== '');
        const allVariations = new Set();

        words.forEach(word => {
            const variations = generateVariations(word);
            variations.forEach(variation => allVariations.add(variation));
        });

        const regexPattern = generateRegex(Array.from(allVariations));
        const output = JSON.stringify({ forbiddenPatterns: regexPattern }, null, 2);

        // Speichern der Ausgabe in der JSON-Datei
        fs.writeFileSync('profanity-list.json', output);
        console.log('profanity-list.json wurde aktualisiert.');
    });
}

main();
