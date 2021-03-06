/**
 * Edge
 */
export class Edge {
  // !!! IMPLEMENT ME
  constructor(destination, weight) {
    this.destination = destination;
    this.weight = weight;
  }
}

/**
 * Vertex
 */
export class Vertex {
  // !!! IMPLEMENT ME
  constructor(value = 'default', pos = { x: -1, y: -1 }) {
    this.edges = [];
    this.value = value;
    this.pos = pos;
  }
}

/**
 * Graph
 */
export class Graph {
  constructor() {
    this.vertexes = [];
  }

  /**
   * Create a random graph
   */
  randomize(width, height, pxBox, probability=0.6) {
    // Helper function to set up two-way edges
    function connectVerts(v0, v1) {
      v0.edges.push(new Edge(v1));
      v1.edges.push(new Edge(v0));
    }

    let count = 0;

    // Build a grid of verts
    let grid = [];
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < width; x++) {
        let v = new Vertex();
        //v.value = 'v' + x + ',' + y;
        v.value = 'v' + count++;
        row.push(v);
      }
      grid.push(row);
    }

    // Go through the grid randomly hooking up edges
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Connect down
        if (y < height - 1) {
          if (Math.random() < probability) {
            connectVerts(grid[y][x], grid[y+1][x]);
          }
        }

        // Connect right
        if (x < width - 1) {
          if (Math.random() < probability) {
            connectVerts(grid[y][x], grid[y][x+1]);
          }
        }
      }
    }

    // Last pass, set the x and y coordinates for drawing
    const boxBuffer = 0.8;
    const boxInner = pxBox * boxBuffer;
    const boxInnerOffset = (pxBox - boxInner) / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid[y][x].pos = {
          'x': (x * pxBox + boxInnerOffset + Math.random() * boxInner) | 0,
          'y': (y * pxBox + boxInnerOffset + Math.random() * boxInner) | 0
        };
      }
    }

    // Finally, add everything in our grid to the vertexes in this Graph
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.vertexes.push(grid[y][x]);
      }
    }
  }

  /**
   * Check if two vertexes are connected
   */
  areConnected(v1, v2) {
    const group = this.dfs(v1);
    return group.includes(v2);
  }

  /**
   * Dump graph data to the console
   */
  dump() {
    let s;

    for (let v of this.vertexes) {
      if (v.pos) {
        s = v.value + ' (' + v.pos.x + ',' + v.pos.y + '):';
      } else {
        s = v.value + ':';
      }

      for (let e of v.edges) {
        s += ` ${e.destination.value}`;
      }
      console.log(s);
    }
  }

  /**
   * BFS
   */
  dfs(start) {
    // !!! IMPLEMENT ME
    const resultArr = [start];

    // Create nested function for recursion
    function search(target) {
      // Track vertexes pushed
      const tempArr = [];
      let pushed = 0;

      target.edges.forEach(edge => {
        // If vertex is not included in result array
        if (!resultArr.includes(edge.destination)) {
          // Push vertex to result and temp arrays
          resultArr.push(edge.destination);
          tempArr.push(edge.destination);
          pushed++;
        }
      });

      // If vertexes were pushed
      if (pushed) {
        // Check their connections
        tempArr.forEach(v => {
          search(v);
        });
      }
    }

    // Begin search
    search(start);
    return resultArr;
  }

  /**
   * Find shortest distance between two vertexes
   */
  findShortestPath(v1, v2) {
    // Return null if vertexes are not connected
    if (!this.areConnected(v1, v2)) return null;

    let shortestPath = [];

    function search(vtarget, path = []) {
      // Prevent infinite loops
      if (path.includes(vtarget)) return;
      else path.push(vtarget);

      // If path reaches end point and is shortest traveled
      if (vtarget === v2 && (shortestPath.length === 0 || path.length < shortestPath.length)) {
        // Set as shortest path
        shortestPath = path;
      } else {
        // Otherwise search all edge paths
        vtarget.edges.forEach(edge => {
          // Slice to prevent adding to original array
          const splitPath = path.slice();
          search(edge.destination, splitPath);
        });
      }
    }

    // Begin search
    search(v1);
    console.log(shortestPath);
    return shortestPath;
  }

  /**
   * Get the connected components
   */
  getConnectedComponents() {
    // !!! IMPLEMENT ME
    // 2D list of connected groups
    const connectedGroups = [];
    // Track all searched vertexes to prevent repetition
    let trackedVertexes = [];

    this.vertexes.forEach(v => {
      if (!trackedVertexes.includes(v)) {
        // Grab all connected vertexes and push to groups array
        const group = this.dfs(v)
        connectedGroups.push(group);
        // All all vertexes from group to tracked array
        trackedVertexes = trackedVertexes.concat(group);
      }
    });

    return connectedGroups;
  }
}
