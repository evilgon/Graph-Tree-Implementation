import cytoscape, {
  Core,
} from 'cytoscape'
import { Parser } from '../parser'
import { Node } from '../tree/tree.interface'
import { IEdge, IGraph, IVertex, Visit } from './graph.interface'

/**
 * (1) Implement IGraph interface
 */
export class Graph {
  cy: Core
  constructor(tree: Node) {
    /**
     * (2) Use Parser interface to parse Node
     */
    const parsedTree = this.parseTree(tree);

    /**
     * (3) Initialize cy with parsed data
     */
    this.cy = cytoscape({
      elements: {
        nodes: parsedTree.vertices.map(item => ({ data: item })),
        edges: parsedTree.edges.map(item => ({ data: item }))
      }
    })
  }

  parseTree: Parser = (tree: Node) => {
    const vertices: IVertex[] = [{
      id: tree.id,
      name: tree.name
    }
    ];
    const edges: IEdge[] = [];
    tree.children.forEach((item) => {
      edges.push({ source: tree.id, target: item.id });
      const childResult = this.parseTree(item);
      vertices.push(...childResult.vertices);
      edges.push(...childResult.edges);
    })
    return { vertices: vertices, edges: edges }
  }

  /**
   * (4) Use cytoscape under the hood
   */
  bfs(visit: Visit<IVertex, IEdge>) {
    this.cy.elements().bfs({
      root: '#A',
      visit: (v, e, u, i, depth) => {
        visit({
          id: v.id(),
          name: v.data('name')
        }, {
          source: e ? e.data('source') : '',
          target: e ? e.data('target') : ''
        })
      }
    })
  }

  /**
   * (5) Use cytoscape under the hood
   */
  dfs(visit: Visit<IVertex, IEdge>) {
    this.cy.elements().dfs({
      root: '#A',
      visit: (v, e, u, i, depth) => {
        visit({
          id: v.id(),
          name: v.data('name')
        }, {
          source: e ? e.data('source') : '',
          target: e ? e.data('target') : ''
        })
      }
    })
  }
}
