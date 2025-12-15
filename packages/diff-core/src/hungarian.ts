/**
 * Hungarian Algorithm (Kuhn-Munkres) for optimal assignment
 *
 * Given a cost matrix C[i][j], finds the assignment of rows to columns
 * that minimizes the total cost.
 *
 * Time complexity: O(n³)
 * Space complexity: O(n²)
 */

/**
 * Core Hungarian algorithm implementation
 * @param costMatrix - n×n matrix where costMatrix[i][j] is the cost of assigning row i to column j
 * @param onProgress - Optional callback called periodically during computation
 * @returns Array where result[i] = j means row i is assigned to column j, or -1 if unassigned
 */
export function hungarian(
  costMatrix: number[][],
  onProgress?: (iteration: number) => void
): number[] {
  const n = costMatrix.length;

  if (n === 0) return [];

  const INF = Number.MAX_SAFE_INTEGER;

  // u[i] and v[j] are the potentials (dual variables)
  const u = new Array(n + 1).fill(0);
  const v = new Array(n + 1).fill(0);

  // p[j] = row assigned to column j (1-indexed, 0 means unassigned)
  // way[j] = previous column in the augmenting path
  const p = new Array(n + 1).fill(0);
  const way = new Array(n + 1).fill(0);

  // Process each row
  for (let i = 1; i <= n; i++) {
    if (onProgress && i % 50 === 0) {
      onProgress(i);
    }

    // Start augmenting path from row i
    p[0] = i;
    let j0 = 0; // Current column in the path (0 is a virtual column)

    // minv[j] = minimum reduced cost to reach column j
    const minv = new Array(n + 1).fill(INF);
    // used[j] = whether column j is in the current tree
    const used = new Array(n + 1).fill(false);

    // Find augmenting path using Dijkstra-like approach
    do {
      used[j0] = true;
      const i0 = p[j0]; // Row currently assigned to column j0
      let delta = INF;
      let j1 = 0; // Next column to add to tree

      // Relax edges from row i0
      for (let j = 1; j <= n; j++) {
        if (!used[j]) {
          // Cost from original matrix (0-indexed)
          const cost =
            i0 >= 1 && i0 <= n && j >= 1 && j <= n
              ? costMatrix[i0 - 1][j - 1]
              : INF;

          // Reduced cost
          const cur = cost - u[i0] - v[j];

          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }

          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }

      // Update potentials
      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }

      j0 = j1;
    } while (p[j0] !== 0); // Continue until we find an unassigned column

    // Reconstruct augmenting path and update assignment
    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0 !== 0);
  }

  // Build result: assignment[i] = j means row i is assigned to column j
  const assignment = new Array(n).fill(-1);
  for (let j = 1; j <= n; j++) {
    if (p[j] !== 0 && p[j] <= n) {
      assignment[p[j] - 1] = j - 1;
    }
  }

  return assignment;
}

/**
 * Async version of Hungarian algorithm that yields periodically
 * to prevent blocking the UI thread.
 */
export async function hungarianAsync(
  costMatrix: number[][],
  yieldFn: () => Promise<void>,
  yieldInterval = 50
): Promise<number[]> {
  const n = costMatrix.length;

  if (n === 0) return [];

  const INF = Number.MAX_SAFE_INTEGER;

  const u = new Array(n + 1).fill(0);
  const v = new Array(n + 1).fill(0);
  const p = new Array(n + 1).fill(0);
  const way = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    // Yield periodically
    if (i % yieldInterval === 0) {
      await yieldFn();
    }

    p[0] = i;
    let j0 = 0;

    const minv = new Array(n + 1).fill(INF);
    const used = new Array(n + 1).fill(false);

    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = INF;
      let j1 = 0;

      for (let j = 1; j <= n; j++) {
        if (!used[j]) {
          const cost =
            i0 >= 1 && i0 <= n && j >= 1 && j <= n
              ? costMatrix[i0 - 1][j - 1]
              : INF;

          const cur = cost - u[i0] - v[j];

          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }

          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }

      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }

      j0 = j1;
    } while (p[j0] !== 0);

    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0 !== 0);
  }

  const assignment = new Array(n).fill(-1);
  for (let j = 1; j <= n; j++) {
    if (p[j] !== 0 && p[j] <= n) {
      assignment[p[j] - 1] = j - 1;
    }
  }

  return assignment;
}
