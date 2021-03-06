/* eslint-disable no-restricted-syntax */
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

import { consts, globals } from '../global';

class Hallway {
  constructor(roomName, hallwayLength, x, z, sides, hexColor) {
    const doorWidth = consts.DOOR_WIDTH;
    this.zAxis = false;
    // setting id of hallway, to be used for pathing algorithm
    this.id = roomName;

    // stores walls facing the center and outside rooms
    this.entrances = [];

    this.unlocked = false;

    if (!sides.up || !sides.down) {
      this.zAxis = true;
    }

    if (this.zAxis) {
      this.minX = x - hallwayLength / 2;
      this.maxX = x + hallwayLength / 2;
      this.minZ = z - doorWidth / 2;
      this.maxZ = z + doorWidth / 2;
    } else {
      this.minZ = z - hallwayLength / 2;
      this.maxZ = z + hallwayLength / 2;
      this.minX = x - doorWidth / 2;
      this.maxX = x + doorWidth / 2;
    }

    /** ********************************************************
     * FLOOR
     ******************************************************** */
    let floorGeo;
    if (this.zAxis) {
      floorGeo = new PlaneGeometry(hallwayLength, doorWidth, 10, 10);
    } else {
      floorGeo = new PlaneGeometry(doorWidth, hallwayLength, 10, 10);
    }

    const floorMaterial = new MeshBasicMaterial({
      color: 0xfdf0c4,
      side: DoubleSide,
      transparent: false,
      wireframe: true,
      opacity: 0.6,
    });
    const floor = new Mesh(floorGeo, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -30;
    floor.position.x = x;
    floor.position.z = z;
    globals.scene.add(floor);

    /**
     * WALLS
     */
    const wallMaterial1 = new MeshBasicMaterial({
      color: hexColor, // PINK 244, 192, 220
      side: DoubleSide,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const wallMaterial2 = new MeshBasicMaterial({
      color: 0xffffff,
      side: DoubleSide,
      wireframe: false,
      transparent: true,
      opacity: 0.6,
    });

    let wall;

    const longWallGeo = new PlaneGeometry(hallwayLength, 75, 75, 10);
    const doorWallGeo = new PlaneGeometry(doorWidth, 75, 10, 10);

    if (!this.zAxis) {
      wall = new Mesh(longWallGeo, wallMaterial1);
      wall.rotation.y = Math.PI / 2;
      wall.position.y = 7.5;
      wall.position.x = x + doorWidth / 2;
      wall.position.z = z;
      globals.scene.add(wall);

      wall = new Mesh(longWallGeo, wallMaterial1);
      wall.rotation.y = Math.PI / 2;
      wall.position.y = 7.5;
      wall.position.x = x - doorWidth / 2;
      wall.position.z = z;
      globals.scene.add(wall);

      wall = new Mesh(doorWallGeo, wallMaterial2);
      wall.position.y = 7.5;
      wall.position.x = x;
      wall.position.z = z - hallwayLength / 2;
      globals.scene.add(wall);
      this.entrances.push(wall);

      wall = new Mesh(doorWallGeo, wallMaterial2);
      wall.position.y = 7.5;
      wall.position.x = x;
      wall.position.z = z + hallwayLength / 2;
      globals.scene.add(wall);
      this.entrances.push(wall);
    } else {
      wall = new Mesh(doorWallGeo, wallMaterial2);
      wall.rotation.y = Math.PI / 2;
      wall.position.y = 7.5;
      wall.position.x = x + hallwayLength / 2;
      wall.position.z = z;
      globals.scene.add(wall);
      this.entrances.push(wall);

      wall = new Mesh(doorWallGeo, wallMaterial2);
      wall.rotation.y = Math.PI / 2;
      wall.position.y = 7.5;
      wall.position.x = x - hallwayLength / 2;
      wall.position.z = z;
      globals.scene.add(wall);
      this.entrances.push(wall);

      wall = new Mesh(longWallGeo, wallMaterial1);
      wall.position.y = 7.5;
      wall.position.x = x;
      wall.position.z = z - doorWidth / 2;
      globals.scene.add(wall);

      wall = new Mesh(longWallGeo, wallMaterial1);
      wall.position.y = 7.5;
      wall.position.x = x;
      wall.position.z = z + doorWidth / 2;
      globals.scene.add(wall);
    }
  }

  isInside(position) {
    if (
      position.x >= this.minX &&
      position.x <= this.maxX &&
      position.z >= this.minZ &&
      position.z <= this.maxZ
    ) {
      return true;
    }

    return false;
  }

  // helper function for reducing the opacity of entrances
  // results in a visual artifact where at times you cannot see behind the rendered wall even though it has opacity of 0
  openEntrance() {
    for (const door of this.entrances) {
      door.material.opacity = 0;
    }
  }
}

export default Hallway;
