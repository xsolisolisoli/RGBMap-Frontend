import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import ForceGraph3D from '3d-force-graph';
import NodeObject from 'force-graph';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'RGBMap-Frontend';

  ngOnInit(): void { 
    var element = document.getElementById('graph');
    if(element) {
      const myGraph = new ForceGraph3D(element)
        .graphData({
          nodes: [
            { id: 1, name: 'Node 1' } as unknown as CustomNodeObject,
            { id: 2, name: 'Node 2' } as unknown as CustomNodeObject,
            { id: 3, name: 'Node 3' } as unknown as CustomNodeObject
          ],
          links: [
            { source: 1, target: 2 },
            { source: 2, target: 3 },
            { source: 3, target: 1 }
          ]
        })
        .nodeLabel('name')
        .linkDirectionalParticles(2);
        // element.appendChild(myGraph);

    }
  }
}
interface CustomNodeObject extends NodeObject {
  name: string;
}

