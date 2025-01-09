import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import ForceGraph3D from '3d-force-graph';
import NodeObject from 'force-graph';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { kmeans } from 'ml-kmeans';
import * as THREE from 'three';

import * as hexData from '../assets/hex_colors.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'RGBMap-Frontend';

  colors: string[] = (hexData as any).default;

  constructor(private http: HttpClient) {}

  ngOnInit(): void { 
    const element = document.getElementById('graph');
    if (element) {
      const rgbValues = this.colors.map(color => {
        const rgb = this.hexToRgb(color);
        return [rgb.r, rgb.g, rgb.b];
      });

      const clusters = kmeans(rgbValues, 10, { initialization: 'kmeans++', maxIterations: 1000 }); // Increase the number of clusters

      const clusterColors = [
        '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', 
        '#00FFFF', '#800000', '#008000', '#000080', '#808000'
      ]; // Define distinct colors for clusters

      const nodes = this.colors.map((color, index) => {
        const rgb = this.hexToRgb(color);
        return {
          id: index,
          x: rgb.r,
          y: rgb.g,
          z: rgb.b,
          name: color,
          color: clusterColors[clusters.clusters[index] % clusterColors.length], // Assign cluster color
          cluster: clusters.clusters[index]
        } as unknown as CustomNodeObject;
      });

      const myGraph = new ForceGraph3D(element)
        .graphData({ nodes, links: [] })
        .nodeLabel('name')
        .nodeColor(node => (node as CustomNodeObject).color)
        .nodeThreeObject(node => {
          const customNode = node as CustomNodeObject;
          const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: customNode.color }));
          sprite.scale.set(10, 10, 1); // Adjust the size of the nodes
          return sprite;
        })
        .linkDirectionalParticles(2);

      // element.appendChild(myGraph);
    }
  }

  loadColors(): Observable<string[]> {
    return this.http.get<string[]>('assets/all_hexes.json');
  }

  hexToRgb(hex: string): { r: number, g: number, b: number } {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }
}
interface CustomNodeObject extends NodeObject {
  name: string;
  color: string;
  cluster: number;
}

