export function createLevel() {
    // 1. On affiche d'abord le décor de fond (le fichier Aseprite)
    // On le place à 0,0 et on lui dit de ne pas bouger avec le scroll si besoin
    const bg = this.add.image(0, 0, 'decor_fond').setOrigin(0, 0);
    // Optionnel : si ton fond est trop grand, réduis-le ici
    bg.setScale(1); 

    const map = this.make.tilemap({ key: 'maMap' }); 
    const tilesetPlateforme = map.addTilesetImage('pixels', 'texturePlateforme'); 

    // 2. On affiche uniquement les plateformes par-dessus
    const sol = map.createLayer('Calque de Tuiles 1', tilesetPlateforme, 0, 0);

    if (sol) {
        sol.setCollisionByProperty({ collides: true });
    }

    return { map, sol }; 
}