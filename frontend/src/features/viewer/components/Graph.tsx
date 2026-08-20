import { useMemo, useState, useRef, useEffect } from 'react';

// Types
export type TimelineNode = {
  id: string;
  label: string;
  date?: string; // optional, just for display
  parents: string[]; // empty = root
  active: boolean; // boolean flag that drives color
  // any extra data
  meta?: Record<string, any>;
};

type Point = { x: number; y: number };
type LayoutNode = TimelineNode & {
  lane: number;
  index: number; // chronological order
  pos: Point;
};

type Edge = {
  from: string;
  to: string;
  path: string;
  color: string;
};

// Layout engine

function layoutGraph(
  nodes: TimelineNode[],
  orientation: 'horizontal' | 'vertical',
  laneSpacing: number,
  stepSpacing: number,
  activeColor: string = '#22c55e',
  inactiveColor: string = '#94a3b850',
): { layoutNodes: LayoutNode[]; edges: Edge[]; width: number; height: number } {
  if (nodes.length === 0) {
    return { layoutNodes: [], edges: [], width: 0, height: 0 };
  }

  // 1. Topological-ish order (we assume the array is already roughly chronological)
  // For safety we do a simple Kahn-style pass using parents
  const idToNode = new Map(nodes.map((n) => [n.id, n]));
  const inDegree = new Map<string, number>();
  const children = new Map<string, string[]>();

  nodes.forEach((n) => {
    inDegree.set(n.id, n.parents.length);
    n.parents.forEach((p) => {
      if (!children.has(p)) children.set(p, []);
      children.get(p)!.push(n.id);
    });
  });

  const queue: string[] = [];
  nodes.forEach((n) => {
    if (inDegree.get(n.id) === 0) queue.push(n.id);
  });

  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    (children.get(id) || []).forEach((child) => {
      const d = inDegree.get(child)! - 1;
      inDegree.set(child, d);
      if (d === 0) queue.push(child);
    });
  }

  // fallback if there are cycles (shouldn't happen)
  if (order.length < nodes.length) {
    nodes.forEach((n) => {
      if (!order.includes(n.id)) order.push(n.id);
    });
  }

  // 2. Assign lanes (classic git-graph algorithm)
  const lanes: (string | null)[] = [];
  const nodeLane = new Map<string, number>();

  order.forEach((id) => {
    const node = idToNode.get(id)!;
    let lane = -1;

    // try to stay in a parent lane
    for (const p of node.parents) {
      const pLane = nodeLane.get(p);
      if (pLane !== undefined && lanes[pLane] === p) {
        lane = pLane;
        break;
      }
    }

    // otherwise find first free lane
    if (lane === -1) {
      lane = lanes.findIndex((l) => l === null);
      if (lane === -1) {
        lane = lanes.length;
        lanes.push(null);
      }
    }

    lanes[lane] = id;
    nodeLane.set(id, lane);

    // free lanes of parents that have no more children in the remaining graph
    // (simplified: free a parent lane only when we are the last child)
  });

  const OFFSET_X = 0;
  const OFFSET_Y = 20;
  const LEFT_PADDING = 16;
  const RIGHT_PADDING = 24;
  const TOP_PADDING = 20;
  const BOTTOM_PADDING = 24;
  const NODE_GLOW_RADIUS = 14;
  const HORIZONTAL_LABEL_HALF_WIDTH = 56;

  // 3. Build layout nodes with coordinates
  const rawLayoutNodes: LayoutNode[] = order.map((id, index) => {
    const node = idToNode.get(id)!;
    const lane = nodeLane.get(id)!;

    const pos =
      orientation === 'horizontal'
        ? {
            x: index * stepSpacing + OFFSET_X,
            y: lane * laneSpacing + OFFSET_Y,
          }
        : {
            x: lane * laneSpacing + OFFSET_X,
            y: index * stepSpacing + OFFSET_Y,
          };

    return { ...node, lane, index, pos };
  });

  // Normalize the graph into positive space with explicit paddings so it never renders clipped on the left.
  const minX = Math.min(
    ...rawLayoutNodes.map((n) =>
      orientation === 'horizontal'
        ? n.pos.x - HORIZONTAL_LABEL_HALF_WIDTH
        : n.pos.x - NODE_GLOW_RADIUS,
    ),
  );
  const minY = Math.min(
    ...rawLayoutNodes.map((n) => n.pos.y - NODE_GLOW_RADIUS),
  );
  const shiftX = Math.max(0, LEFT_PADDING - minX);
  const shiftY = Math.max(0, TOP_PADDING - minY);

  const layoutNodes: LayoutNode[] = rawLayoutNodes.map((node) => ({
    ...node,
    pos: {
      x: node.pos.x + shiftX,
      y: node.pos.y + shiftY,
    },
  }));

  const posMap = new Map(layoutNodes.map((n) => [n.id, n.pos]));

  // 4. Build edges
  const edges: Edge[] = [];
  layoutNodes.forEach((node) => {
    node.parents.forEach((parentId) => {
      const from = posMap.get(parentId);
      const to = posMap.get(node.id);
      if (!from || !to) return;

      const color = node.active ? activeColor : inactiveColor;

      let path: string;
      if (orientation === 'horizontal') {
        const mid = from.x + (to.x - from.x) * 0.55;

        if (from.y === to.y) {
          path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
        } else {
          path = `M ${from.x} ${from.y} H ${mid} V ${to.y} H ${to.x}`;
        }
      } else {
        const mid = from.y + (to.y - from.y) * 0.55;

        if (from.x === to.x) {
          path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
        } else {
          path = `M ${from.x} ${from.y} V ${mid} H ${to.x} V ${to.y}`;
        }
      }

      edges.push({ from: parentId, to: node.id, path, color });
    });
  });

  // 5. Bounds derived from adjusted positions.
  const maxX = Math.max(
    ...layoutNodes.map((n) =>
      orientation === 'horizontal'
        ? n.pos.x + HORIZONTAL_LABEL_HALF_WIDTH
        : n.pos.x + NODE_GLOW_RADIUS,
    ),
  );
  const maxY = Math.max(...layoutNodes.map((n) => n.pos.y + NODE_GLOW_RADIUS));

  const width = Math.ceil(maxX + RIGHT_PADDING);
  const height = Math.ceil(maxY + BOTTOM_PADDING);

  return { layoutNodes, edges, width, height };
}

// Component
type TimelineGraphProps = {
  nodes: TimelineNode[];
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
  onNodeHover?: (node: TimelineNode | null) => void;
  onNodeClick?: (node: TimelineNode) => void;
};

export function TimelineGraph({
  nodes,
  className,
  activeColor = '#22c55e',
  inactiveColor = '#94a3b8',
  onNodeHover,
  onNodeClick,
}: TimelineGraphProps) {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal',
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // responsive
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setOrientation(mq.matches ? 'vertical' : 'horizontal');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const laneSpacing = orientation === 'horizontal' ? 56 : 64;
  const stepSpacing = orientation === 'horizontal' ? 110 : 80;

  const { layoutNodes, edges, width, height } = useMemo(
    () =>
      layoutGraph(
        nodes,
        orientation,
        laneSpacing,
        stepSpacing,
        activeColor,
        inactiveColor,
      ),
    [nodes, orientation, laneSpacing, stepSpacing],
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        overflow: 'auto', // auto
        padding: 0, // 16
        cursor: 'grab',
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          display: 'block',
          minWidth: orientation === 'horizontal' ? width : undefined,
          marginInline: 'auto',
        }}
      >
        {/* Edges */}
        {edges.map((e) => (
          <path
            key={`${e.from}-${e.to}`}
            d={e.path}
            fill="none"
            stroke={e.color}
            strokeWidth={8.5}
            strokeLinecap="round"
            opacity={1}
          />
        ))}

        {/* Nodes */}
        {layoutNodes.map((node) => {
          const isHovered = hoveredId === node.id;
          const color = node.active ? activeColor : inactiveColor;

          return (
            <g
              key={node.id}
              transform={`translate(${node.pos.x}, ${node.pos.y})`}
              style={{ cursor: 'pointer' }}
            >
              {/* outer glow when hovered */}
              {
                <circle
                  r={14}
                  //fill={isHovered ? color : 'none'}
                  opacity={0.25}
                  style={{
                    transition: 'fill .1s ease-in-out',
                    fill: isHovered ? color : 'transparent',
                  }}
                />
              }
              {/* main dot */}
              {/*stroke = circle rim color*/}
              <circle
                r={8}
                fill={color}
                stroke={color}
                strokeWidth={2.5}
                onMouseEnter={() => {
                  setHoveredId(node.id);
                  onNodeHover?.(node);
                }}
                onMouseLeave={() => {
                  setHoveredId(null);
                  onNodeHover?.(null);
                }}
                onClick={() => onNodeClick?.(node)}
              />{' '}
              {/* subtle ring */}
              {/*<circle
                r={11}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                opacity={0.35}
              />*/}
              {/* label */}
              <text
                x={orientation === 'horizontal' ? 0 : 18}
                y={orientation === 'horizontal' ? 28 : 5}
                textAnchor={orientation === 'horizontal' ? 'middle' : 'start'}
                fontSize={13}
                fontFamily="system-ui, sans-serif"
                fill="#1e293b"
                fontWeight={500}
              >
                {node.label.slice(0, 14)}
              </text>
              <text
                x={orientation === 'horizontal' ? 0 : 18}
                y={orientation === 'horizontal' ? 40 : 18}
                textAnchor={orientation === 'horizontal' ? 'middle' : 'start'}
                fontSize={13}
                fontFamily="system-ui, sans-serif"
                fill="#1e293b"
                fontWeight={500}
              >
                {node.label.slice(14, node.label.length)}
              </text>
              {/* optional date */}
              {node.date && (
                <text
                  x={orientation === 'horizontal' ? 0 : 18}
                  y={orientation === 'horizontal' ? 54 : 32}
                  textAnchor={orientation === 'horizontal' ? 'middle' : 'start'}
                  fontSize={11}
                  fontFamily="system-ui, sans-serif"
                  fill="#64748b"
                >
                  {node.date}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
