export function setupCamera(map) {
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.player, true, 0.1, 0.1);
    camera.setZoom(1.8);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
}