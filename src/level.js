export function createLevel() {
    const map = this.make.tilemap({ key: 'maMap' }); 
    const tilesetFond = map.addTilesetImage('fond', 'mesTuiles');
    const tilesetPlateforme = map.addTilesetImage('pixels', 'texturePlateforme'); 
    const sol = map.createLayer('Calque de Tuiles 1', [tilesetFond, tilesetPlateforme], 0, 0);

    if (sol) {
        sol.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        sol.setCollisionByProperty({ collides: true });
    }

    return sol;
}