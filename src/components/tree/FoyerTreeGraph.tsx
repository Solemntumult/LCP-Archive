'use client';

import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Heart,
  GitFork,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  User,
  ArrowLeft,
} from 'lucide-react';
import { FoyerData, FoyerChildData, FoyerSpouseData, TreeNodeData } from '@/types';
import PersonDetailDrawer from './PersonDetailDrawer';

interface FoyerTreeGraphProps {
  foyerData: FoyerData;
  allPersons: TreeNodeData[];
  onDeployChild: (childId: number) => void;
  onAddMemberClick?: () => void;
  canGoBack?: boolean;
  onGoBack?: () => void;
  previousPersonName?: string;
}

interface NodeLayout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'root' | 'spouse' | 'child';
  person?: TreeNodeData;
  spouse?: FoyerSpouseData;
  child?: FoyerChildData;
}

interface ConnectorPath {
  id: string;
  d: string;
  type: 'union' | 'filiation' | 'branch';
}

const NODE_WIDTH = 130;
const NODE_HEIGHT_BASE = 86;
const NODE_HEIGHT_CHILD = 114;
const H_GAP = 28;
const V_GAP_CHILDREN = 75;

/**
 * Extrait le premier prénom de la personne pour l'affichage épuré sous le rond de l'arbre.
 * Ignore le nom de famille en majuscules (ex: LISSANON) pour n'afficher que le prénom usuel.
 */
function getFirstGivenName(
  firstName: string | null | undefined,
  fallbackName: string | null | undefined
): string {
  const target = firstName?.trim() || fallbackName?.trim() || '';
  if (!target) return '';

  if (target.toLowerCase().startsWith('epouse ')) return target;

  const firstToken = target.split(/\s+/)[0];
  return firstToken || target;
}

/**
 * FoyerTreeGraph — Minimalist & Authentic Genealogical SVG Tree Graph.
 * 
 * Features:
 * - Fluid mobile finger drag / pan & pinch-to-zoom
 * - Direct in-graph '← Retour' button for instant navigation to parent household
 * - Silky-smooth dampened wheel zooming (gentle and progressive)
 * - Isolated scrolling: scrolling/zooming on the graph does not scroll the outer page
 * - Click-outside dismisses the person detail pop-up
 * - Ultra-clean nodes: Circular portrait avatar + First name pill + Optional [Déployer] button
 */
export default function FoyerTreeGraph({
  foyerData,
  allPersons,
  onDeployChild,
  onAddMemberClick,
  canGoBack,
  onGoBack,
  previousPersonName,
}: FoyerTreeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan & Zoom states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keep latest pan & zoom in refs for ultra-responsive zero-lag touch handlers
  const panRef = useRef(pan);
  panRef.current = pan;
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  // Selected person for detail popup drawer
  const [selectedPerson, setSelectedPerson] = useState<TreeNodeData | null>(null);

  // ----------------------------------------------------
  // Compute Tree Layout Coordinates
  // ----------------------------------------------------
  const { nodes, connectors, bounds } = useMemo(() => {
    const calculatedNodes: NodeLayout[] = [];
    const calculatedConnectors: ConnectorPath[] = [];

    const { person, spouses, childrenGroups } = foyerData;
    const distinctSpouses = (spouses || []).filter((s) => Boolean(s && s.id));
    const groupsWithSpouse = childrenGroups.filter((g) => Boolean(g.spouse && g.spouse.id));
    const groupWithoutSpouse = childrenGroups.find((g) => !g.spouse || !g.spouse.id) || null;
    const directChildren = groupWithoutSpouse ? groupWithoutSpouse.children : [];

    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;

    // ------------------------------------------------------------------
    // SCENARIO 1: Single Couple with Both Union Children & Direct Children
    // (e.g. Janvier + Marita -> Maurine & Nelson, + Solid L-branch from Janvier to Tonami & Rebecca)
    // ------------------------------------------------------------------
    if (distinctSpouses.length === 1 && directChildren.length > 0) {
      const spouse = distinctSpouses[0];
      const unionChildren = groupsWithSpouse[0]?.children || [];

      const uCount = unionChildren.length;
      const uChildrenWidth = uCount > 0 ? uCount * NODE_WIDTH + (uCount - 1) * H_GAP : NODE_WIDTH;
      const coupleWidth = NODE_WIDTH * 2 + 50;
      const unionBlockWidth = Math.max(uChildrenWidth, coupleWidth, 320);

      const dCount = directChildren.length;
      const directBlockWidth = dCount * NODE_WIDTH + (dCount - 1) * H_GAP;

      const BLOCK_GAP = 60;
      const totalWidth = unionBlockWidth + BLOCK_GAP + directBlockWidth;

      const rootY = 30;
      const spouseY = 30;

      // 1. Direct Children Block (Left): Tonami, Rebecca
      const directStartX = 0;
      const directCenterX = directBlockWidth / 2;

      // 2. Union Block (Right): Janvier + Marita + (Maurine, Nelson)
      const unionStartX = directBlockWidth + BLOCK_GAP;
      const unionCenterX = unionStartX + unionBlockWidth / 2;
      const rootX = unionCenterX - NODE_WIDTH - 25;
      const spouseX = unionCenterX + 25;

      calculatedNodes.push({
        id: `root-${person.id}`,
        x: rootX,
        y: rootY,
        width: NODE_WIDTH,
        height: NODE_HEIGHT_BASE,
        type: 'root',
        person,
      });

      calculatedNodes.push({
        id: `spouse-${spouse.id}`,
        x: spouseX,
        y: spouseY,
        width: NODE_WIDTH,
        height: NODE_HEIGHT_BASE,
        type: 'spouse',
        spouse,
      });

      // Gold dashed marriage line between Janvier and Marita
      const avatarCenterY = rootY + 26;
      const marriageLeftX = rootX + NODE_WIDTH / 2 + 26;
      const marriageRightX = spouseX + NODE_WIDTH / 2 - 26;
      calculatedConnectors.push({
        id: `union-${person.id}-${spouse.id}`,
        d: `M ${marriageLeftX} ${avatarCenterY} L ${marriageRightX} ${avatarCenterY}`,
        type: 'union',
      });

      const stemStartY = avatarCenterY;
      const stemEndY = rootY + NODE_HEIGHT_BASE + V_GAP_CHILDREN - 24;
      const childY = rootY + NODE_HEIGHT_BASE + V_GAP_CHILDREN;

      // Union children (Maurine, Nelson) on the right
      if (uCount > 0) {
        calculatedConnectors.push({
          id: `filiation-stem-union`,
          d: `M ${unionCenterX} ${stemStartY} L ${unionCenterX} ${stemEndY}`,
          type: 'filiation',
        });

        const firstUChildX = unionCenterX - uChildrenWidth / 2 + NODE_WIDTH / 2;
        const lastUChildX = firstUChildX + (uCount - 1) * (NODE_WIDTH + H_GAP);

        if (uCount > 1) {
          calculatedConnectors.push({
            id: `union-children-rail`,
            d: `M ${firstUChildX} ${stemEndY} L ${lastUChildX} ${stemEndY}`,
            type: 'branch',
          });
        }

        unionChildren.forEach((child, idx) => {
          const cX = unionCenterX - uChildrenWidth / 2 + idx * (NODE_WIDTH + H_GAP);
          const cCenterX = cX + NODE_WIDTH / 2;
          calculatedNodes.push({
            id: `child-${child.id}`,
            x: cX,
            y: childY,
            width: NODE_WIDTH,
            height: NODE_HEIGHT_CHILD,
            type: 'child',
            child,
          });
          calculatedConnectors.push({
            id: `child-drop-${child.id}`,
            d: `M ${cCenterX} ${stemEndY} L ${cCenterX} ${childY}`,
            type: 'filiation',
          });
        });
      }

      // Direct children (Tonami, Rebecca) on the left
      // Solid L-connector from Janvier to the direct children block on the left (ZERO line crossings!)
      const janvierCenterX = rootX + NODE_WIDTH / 2;
      const rootBottomY = rootY + NODE_HEIGHT_BASE;
      const bridgeY = rootY + NODE_HEIGHT_BASE + 20;

      calculatedConnectors.push({
        id: `direct-filiation-L-branch`,
        d: `M ${janvierCenterX} ${rootBottomY} L ${janvierCenterX} ${bridgeY} L ${directCenterX} ${bridgeY} L ${directCenterX} ${stemEndY}`,
        type: 'filiation',
      });

      const firstDChildX = directStartX + NODE_WIDTH / 2;
      const lastDChildX = firstDChildX + (dCount - 1) * (NODE_WIDTH + H_GAP);

      if (dCount > 1) {
        calculatedConnectors.push({
          id: `direct-children-rail`,
          d: `M ${firstDChildX} ${stemEndY} L ${lastDChildX} ${stemEndY}`,
          type: 'branch',
        });
      }

      directChildren.forEach((child, idx) => {
        const cX = directStartX + idx * (NODE_WIDTH + H_GAP);
        const cCenterX = cX + NODE_WIDTH / 2;
        calculatedNodes.push({
          id: `child-${child.id}`,
          x: cX,
          y: childY,
          width: NODE_WIDTH,
          height: NODE_HEIGHT_CHILD,
          type: 'child',
          child,
        });
        calculatedConnectors.push({
          id: `child-drop-${child.id}`,
          d: `M ${cCenterX} ${stemEndY} L ${cCenterX} ${childY}`,
          type: 'filiation',
        });
      });

      maxY = childY + NODE_HEIGHT_CHILD + 40;
      minX = 0;
      maxX = totalWidth;
    }
    // ------------------------------------------------------------------
    // SCENARIO 2: Standard Single Couple or Single Parent alone (no mixed outside branch)
    // ------------------------------------------------------------------
    else if (distinctSpouses.length <= 1) {
      const spouse = distinctSpouses[0] || null;
      const children = foyerData.childrenGroups.flatMap((g) => g.children);
      const childrenCount = children.length;
      const childrenRowWidth =
        childrenCount > 0
          ? childrenCount * NODE_WIDTH + (childrenCount - 1) * H_GAP
          : NODE_WIDTH;

      const parentsWidth = spouse ? NODE_WIDTH * 2 + 50 : NODE_WIDTH;
      const contentWidth = Math.max(childrenRowWidth, parentsWidth, 380);
      const centerX = contentWidth / 2;

      let rootX = centerX - NODE_WIDTH / 2;
      const rootY = 30;

      if (spouse) {
        // Horizontal marriage junction: Root on left, Spouse on right
        rootX = centerX - NODE_WIDTH - 25;
        const spouseX = centerX + 25;
        const spouseY = rootY;

        calculatedNodes.push({
          id: `root-${person.id}`,
          x: rootX,
          y: rootY,
          width: NODE_WIDTH,
          height: NODE_HEIGHT_BASE,
          type: 'root',
          person,
        });

        calculatedNodes.push({
          id: `spouse-${spouse.id}`,
          x: spouseX,
          y: spouseY,
          width: NODE_WIDTH,
          height: NODE_HEIGHT_BASE,
          type: 'spouse',
          spouse,
        });

        // Marriage line between Root Avatar and Spouse Avatar
        const avatarCenterY = rootY + 26; // Center of 52px avatar
        const marriageLeftX = rootX + NODE_WIDTH / 2 + 26;
        const marriageRightX = spouseX + NODE_WIDTH / 2 - 26;
        const junctionX = centerX;

        calculatedConnectors.push({
          id: `union-${person.id}-${spouse.id}`,
          d: `M ${marriageLeftX} ${avatarCenterY} L ${marriageRightX} ${avatarCenterY}`,
          type: 'union',
        });

        // Filiation stem from marriage junction down to children branch
        if (childrenCount > 0) {
          const stemStartY = avatarCenterY;
          const stemEndY = rootY + NODE_HEIGHT_BASE + V_GAP_CHILDREN - 24;

          calculatedConnectors.push({
            id: `filiation-stem`,
            d: `M ${junctionX} ${stemStartY} L ${junctionX} ${stemEndY}`,
            type: 'filiation',
          });

          // Horizontal branch across children
          const firstChildCenterX =
            centerX - childrenRowWidth / 2 + NODE_WIDTH / 2;
          const lastChildCenterX =
            firstChildCenterX + (childrenCount - 1) * (NODE_WIDTH + H_GAP);

          if (childrenCount > 1) {
            calculatedConnectors.push({
              id: `children-rail`,
              d: `M ${firstChildCenterX} ${stemEndY} L ${lastChildCenterX} ${stemEndY}`,
              type: 'branch',
            });
          }

          // Drop line to each child
          const childY = rootY + NODE_HEIGHT_BASE + V_GAP_CHILDREN;
          children.forEach((child, idx) => {
            const childX =
              centerX -
              childrenRowWidth / 2 +
              idx * (NODE_WIDTH + H_GAP);
            const childCenterX = childX + NODE_WIDTH / 2;

            calculatedNodes.push({
              id: `child-${child.id}`,
              x: childX,
              y: childY,
              width: NODE_WIDTH,
              height: NODE_HEIGHT_CHILD,
              type: 'child',
              child,
            });

            calculatedConnectors.push({
              id: `child-drop-${child.id}`,
              d: `M ${childCenterX} ${stemEndY} L ${childCenterX} ${childY}`,
              type: 'filiation',
            });
          });

          maxY = childY + NODE_HEIGHT_CHILD + 40;
        } else {
          maxY = rootY + NODE_HEIGHT_BASE + 60;
        }
      } else {
        // No spouse — root at center
        calculatedNodes.push({
          id: `root-${person.id}`,
          x: rootX,
          y: rootY,
          width: NODE_WIDTH,
          height: NODE_HEIGHT_BASE,
          type: 'root',
          person,
        });

        if (childrenCount > 0) {
          const stemStartX = centerX;
          const stemStartY = rootY + NODE_HEIGHT_BASE;
          const stemEndY = rootY + NODE_HEIGHT_BASE + V_GAP_CHILDREN - 24;

          calculatedConnectors.push({
            id: `filiation-stem-nospouse`,
            d: `M ${stemStartX} ${stemStartY} L ${stemStartX} ${stemEndY}`,
            type: 'filiation',
          });

          const firstChildCenterX =
            centerX - childrenRowWidth / 2 + NODE_WIDTH / 2;
          const lastChildCenterX =
            firstChildCenterX + (childrenCount - 1) * (NODE_WIDTH + H_GAP);

          if (childrenCount > 1) {
            calculatedConnectors.push({
              id: `children-rail`,
              d: `M ${firstChildCenterX} ${stemEndY} L ${lastChildCenterX} ${stemEndY}`,
              type: 'branch',
            });
          }

          const childY = rootY + NODE_HEIGHT_BASE + V_GAP_CHILDREN;
          children.forEach((child, idx) => {
            const childX =
              centerX -
              childrenRowWidth / 2 +
              idx * (NODE_WIDTH + H_GAP);
            const childCenterX = childX + NODE_WIDTH / 2;

            calculatedNodes.push({
              id: `child-${child.id}`,
              x: childX,
              y: childY,
              width: NODE_WIDTH,
              height: NODE_HEIGHT_CHILD,
              type: 'child',
              child,
            });

            calculatedConnectors.push({
              id: `child-drop-${child.id}`,
              d: `M ${childCenterX} ${stemEndY} L ${childCenterX} ${childY}`,
              type: 'filiation',
            });
          });

          maxY = childY + NODE_HEIGHT_CHILD + 40;
        } else {
          maxY = rootY + NODE_HEIGHT_BASE + 60;
        }
      }

      minX = 0;
      maxX = contentWidth;
    } else {
      // ------------------------------------------------------------------
      // SCENARIO 3: Multiple Unions / Recomposed Family (e.g. Paul with Rosalie & Lucienne)
      // ------------------------------------------------------------------
      const unionBlockWidths = childrenGroups.map((group) => {
        const cCount = group.children.length;
        const cWidth =
          cCount > 0
            ? cCount * NODE_WIDTH + (cCount - 1) * H_GAP
            : NODE_WIDTH;
        return Math.max(cWidth, NODE_WIDTH + 20);
      });

      const UNION_SPACING = 40;
      const totalMultiWidth =
        unionBlockWidths.reduce((sum, w) => sum + w, 0) +
        (childrenGroups.length - 1) * UNION_SPACING;

      const fullWidth = Math.max(totalMultiWidth, 540);
      const rootX = fullWidth / 2 - NODE_WIDTH / 2;
      const rootY = 25;

      calculatedNodes.push({
        id: `root-${person.id}`,
        x: rootX,
        y: rootY,
        width: NODE_WIDTH,
        height: NODE_HEIGHT_BASE,
        type: 'root',
        person,
      });

      const rootCenterX = fullWidth / 2;
      const rootBottomY = rootY + NODE_HEIGHT_BASE;
      const unionRailY = rootBottomY + 28;

      calculatedConnectors.push({
        id: `root-to-union-rail`,
        d: `M ${rootCenterX} ${rootBottomY} L ${rootCenterX} ${unionRailY}`,
        type: 'filiation',
      });

      let currentUnionLeftX = (fullWidth - totalMultiWidth) / 2;
      const unionCentersX: number[] = [];

      childrenGroups.forEach((group, uIdx) => {
        const blockWidth = unionBlockWidths[uIdx];
        const unionCenterX = currentUnionLeftX + blockWidth / 2;
        unionCentersX.push(unionCenterX);

        const spouse = group.spouse;
        const spouseY = unionRailY + 22;

        if (spouse) {
          const spouseX = unionCenterX - NODE_WIDTH / 2;
          calculatedNodes.push({
            id: `spouse-${spouse.id}`,
            x: spouseX,
            y: spouseY,
            width: NODE_WIDTH,
            height: NODE_HEIGHT_BASE,
            type: 'spouse',
            spouse,
          });

          calculatedConnectors.push({
            id: `rail-to-spouse-${spouse.id}`,
            d: `M ${unionCenterX} ${unionRailY} L ${unionCenterX} ${spouseY}`,
            type: 'union',
          });

          const children = group.children;
          if (children.length > 0) {
            const childRailY = spouseY + NODE_HEIGHT_BASE + 28;
            const cWidth =
              children.length * NODE_WIDTH +
              (children.length - 1) * H_GAP;
            const cStartX = unionCenterX - cWidth / 2;

            calculatedConnectors.push({
              id: `spouse-to-child-rail-${spouse.id}`,
              d: `M ${unionCenterX} ${spouseY + NODE_HEIGHT_BASE} L ${unionCenterX} ${childRailY}`,
              type: 'filiation',
            });

            if (children.length > 1) {
              const firstChildX = cStartX + NODE_WIDTH / 2;
              const lastChildX =
                cStartX +
                (children.length - 1) * (NODE_WIDTH + H_GAP) +
                NODE_WIDTH / 2;
              calculatedConnectors.push({
                id: `child-rail-${uIdx}`,
                d: `M ${firstChildX} ${childRailY} L ${lastChildX} ${childRailY}`,
                type: 'branch',
              });
            }

            const childY = childRailY + 22;
            children.forEach((child, cIdx) => {
              const cX = cStartX + cIdx * (NODE_WIDTH + H_GAP);
              const cCenterX = cX + NODE_WIDTH / 2;

              calculatedNodes.push({
                id: `child-${child.id}`,
                x: cX,
                y: childY,
                width: NODE_WIDTH,
                height: NODE_HEIGHT_CHILD,
                type: 'child',
                child,
              });

              calculatedConnectors.push({
                id: `child-drop-${child.id}`,
                d: `M ${cCenterX} ${childRailY} L ${cCenterX} ${childY}`,
                type: 'filiation',
              });
            });

            maxY = Math.max(maxY, childY + NODE_HEIGHT_CHILD + 40);
          } else {
            maxY = Math.max(maxY, spouseY + NODE_HEIGHT_BASE + 50);
          }
        } else {
          // Group without identified spouse (e.g. other children / hors union)
          const children = group.children;
          if (children.length > 0) {
            const childRailY = spouseY + NODE_HEIGHT_BASE + 28;
            const cWidth =
              children.length * NODE_WIDTH +
              (children.length - 1) * H_GAP;
            const cStartX = unionCenterX - cWidth / 2;

            calculatedConnectors.push({
              id: `union-to-child-rail-nospouse-${uIdx}`,
              d: `M ${unionCenterX} ${unionRailY} L ${unionCenterX} ${childRailY}`,
              type: 'filiation',
            });

            if (children.length > 1) {
              const firstChildX = cStartX + NODE_WIDTH / 2;
              const lastChildX =
                cStartX +
                (children.length - 1) * (NODE_WIDTH + H_GAP) +
                NODE_WIDTH / 2;
              calculatedConnectors.push({
                id: `child-rail-nospouse-${uIdx}`,
                d: `M ${firstChildX} ${childRailY} L ${lastChildX} ${childRailY}`,
                type: 'branch',
              });
            }

            const childY = childRailY + 22;
            children.forEach((child, cIdx) => {
              const cX = cStartX + cIdx * (NODE_WIDTH + H_GAP);
              const cCenterX = cX + NODE_WIDTH / 2;

              calculatedNodes.push({
                id: `child-${child.id}`,
                x: cX,
                y: childY,
                width: NODE_WIDTH,
                height: NODE_HEIGHT_CHILD,
                type: 'child',
                child,
              });

              calculatedConnectors.push({
                id: `child-drop-${child.id}`,
                d: `M ${cCenterX} ${childRailY} L ${cCenterX} ${childY}`,
                type: 'filiation',
              });
            });

            maxY = Math.max(maxY, childY + NODE_HEIGHT_CHILD + 40);
          }
        }

        currentUnionLeftX += blockWidth + UNION_SPACING;
      });

      if (unionCentersX.length > 1) {
        calculatedConnectors.push({
          id: `unions-horizontal-rail`,
          d: `M ${unionCentersX[0]} ${unionRailY} L ${unionCentersX[unionCentersX.length - 1]} ${unionRailY}`,
          type: 'union',
        });
      }

      minX = 0;
      maxX = fullWidth;
    }

    return {
      nodes: calculatedNodes,
      connectors: calculatedConnectors,
      bounds: {
        minX,
        maxX,
        minY,
        maxY: Math.max(maxY, 360),
        width: Math.max(maxX - minX, 480),
        height: Math.max(maxY - minY, 360),
      },
    };
  }, [foyerData]);

  // ----------------------------------------------------
  // Auto-Center & Fit
  // ----------------------------------------------------
  const fitToScreen = useCallback(() => {
    if (!containerRef.current || !bounds) return;
    const cWidth = containerRef.current.clientWidth;
    const cHeight = containerRef.current.clientHeight;

    const scaleX = (cWidth - 40) / bounds.width;
    const scaleY = (cHeight - 40) / bounds.height;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.6), 1.1);

    const treeCenterX = bounds.width / 2;
    setZoom(newZoom);
    setPan({
      x: cWidth / 2 - treeCenterX * newZoom,
      y: 20,
    });
  }, [bounds]);

  useEffect(() => {
    fitToScreen();
  }, [fitToScreen, foyerData]);

  // ----------------------------------------------------
  // NATIVE MOBILE TOUCH & WHEEL GESTURE LISTENERS
  // Allows full, fluid finger-dragging (pan) and pinch-zooming on mobile
  // ----------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Wheel Zoom (Gentle & Progressive)
    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const sensitivity = 0.0008;
      const delta = -e.deltaY * sensitivity;
      const clampedDelta = Math.max(-0.035, Math.min(0.035, delta));
      const factor = 1 + clampedDelta;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setZoom((prevZoom) => {
        const newZoom = Math.min(Math.max(prevZoom * factor, 0.4), 1.8);
        setPan((prevPan) => ({
          x: mouseX - (mouseX - prevPan.x) * (newZoom / prevZoom),
          y: mouseY - (mouseY - prevPan.y) * (newZoom / prevZoom),
        }));
        return newZoom;
      });
    };

    // 2. Mobile Touch Gestures (Single finger Pan & Two finger Pinch Zoom)
    let isTouchDragging = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let initialPanX = 0;
    let initialPanY = 0;
    let initialPinchDist = 0;
    let initialZoom = 1;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        isTouchDragging = true;
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        initialPanX = panRef.current.x;
        initialPanY = panRef.current.y;
      } else if (e.touches.length === 2) {
        isTouchDragging = false;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        initialZoom = zoomRef.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isTouchDragging) {
        // Prevent outer browser page scrolling and smoothly pan the tree graph
        e.preventDefault();
        const t = e.touches[0];
        const dx = t.clientX - touchStartX;
        const dy = t.clientY - touchStartY;
        setPan({
          x: initialPanX + dx,
          y: initialPanY + dy,
        });
      } else if (e.touches.length === 2 && initialPinchDist > 0) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        if (currentDist > 10) {
          const ratio = currentDist / initialPinchDist;
          const newZoom = Math.min(Math.max(initialZoom * ratio, 0.4), 1.8);
          setZoom(newZoom);
        }
      }
    };

    const handleTouchEnd = () => {
      isTouchDragging = false;
      initialPinchDist = 0;
    };

    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleNativeWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  // ----------------------------------------------------
  // Desktop Mouse Drag / Pan Handlers
  // ----------------------------------------------------
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Helper to open person detail popup for root, spouse, or child
  const handleNodeClick = (node: NodeLayout, e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.person) {
      setSelectedPerson(node.person);
    } else if (node.spouse) {
      const found = allPersons.find((p) => p.id === node.spouse?.id);
      if (found) {
        setSelectedPerson(found);
      } else {
        setSelectedPerson({
          id: node.spouse.id,
          name: node.spouse.name,
          first_name: node.spouse.first_name,
          last_name: node.spouse.last_name,
          gender: node.spouse.gender,
          birth_date: node.spouse.birth_date,
          death_date: node.spouse.death_date,
          photo_url: node.spouse.photo_url,
          profession: node.spouse.profession,
          is_blood: false,
          generation: foyerData.person.generation,
          children_count: 0,
          children_by_spouse: [],
        });
      }
    } else if (node.child) {
      const found = allPersons.find((p) => p.id === node.child?.id);
      if (found) {
        setSelectedPerson(found);
      } else {
        setSelectedPerson({
          id: node.child.id,
          name: node.child.name,
          first_name: node.child.first_name,
          last_name: node.child.last_name,
          gender: node.child.gender,
          birth_date: node.child.birth_date,
          death_date: node.child.death_date,
          photo_url: node.child.photo_url,
          profession: node.child.profession,
          is_blood: true,
          generation: (foyerData.person.generation || 0) + 1,
          children_count: node.child.descendantsCount,
          children_by_spouse: [],
        });
      }
    }
  };

  return (
    <div className="relative space-y-2">
      {/* ── Toolbar Overlay (Integrated direct Retour Button + Zoom) ── */}
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#eae1da] vintage-shadow text-xs">
        <div className="flex items-center gap-2 min-w-0">
          {/* Direct prominent Retour button inside graph toolbar */}
          {canGoBack && onGoBack && (
            <button
              onClick={onGoBack}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#173124] text-white hover:bg-[#2d4739] rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
              title={`Revenir au foyer de ${previousPersonName || 'précédent'}`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#fdcea9]" />
              <span> Retour {previousPersonName ? `(${previousPersonName.split(' ')[0]})` : ''}</span>
            </button>
          )}

          <span className="font-serif font-bold text-[#173124] flex items-center gap-1.5 text-xs truncate">
            <GitFork className="w-3.5 h-3.5 text-[#7a5739] shrink-0" />
            <span className="truncate">Graphe du Foyer</span>
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setZoom((z) => Math.max(z * 0.9, 0.4))}
            className="p-1 rounded-lg hover:bg-[#f5ece5] text-[#424844] transition-all"
            title="Dézoomer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] font-bold text-[#7a5739] px-1 min-w-[34px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(z * 1.1, 1.8))}
            className="p-1 rounded-lg hover:bg-[#f5ece5] text-[#424844] transition-all"
            title="Zoomer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={fitToScreen}
            className="p-1 rounded-lg hover:bg-[#f5ece5] text-[#424844] transition-all ml-0.5"
            title="Recentrer le graphe"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded-lg hover:bg-[#f5ece5] text-[#424844] transition-all"
            title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Main Tree Graph Canvas (Fluid Pan on Mobile & Desktop) ── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          // Clicking anywhere on the canvas background dismisses the detail pop-up
          if (selectedPerson) setSelectedPerson(null);
        }}
        style={{
          overscrollBehavior: 'contain',
          touchAction: 'none',
        }}
        className={`relative w-full ${
          isFullscreen
            ? 'fixed inset-0 z-50 h-screen rounded-none'
            : 'h-[460px] sm:h-[540px] rounded-3xl'
        } overflow-hidden border border-[#eae1da] bg-[#fff8f4] parchment-texture vintage-shadow-lg select-none cursor-grab active:cursor-grabbing transition-all overscroll-contain touch-none`}
      >
        {/* Subtle Genealogical Canvas Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(#7a5739 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Transformed Tree Layer */}
        <div
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${bounds.width}px`,
            height: `${bounds.height}px`,
          }}
        >
          {/* ── SVG Connectors Layer ── */}
          <svg
            className="overflow-visible pointer-events-none absolute left-0 top-0"
            style={{ width: `${bounds.width}px`, height: `${bounds.height}px` }}
          >
            {connectors.map((c) => {
              const isUnion = c.type === 'union';
              return (
                <path
                  key={c.id}
                  d={c.d}
                  fill="none"
                  stroke={isUnion ? '#c69214' : '#7a5739'}
                  strokeWidth={2.5}
                  strokeDasharray={isUnion ? '5,4' : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </svg>

          {/* ── HTML Tree Nodes Layer (Clean Circular Avatar + Name Frame) ── */}
          <div className="absolute inset-0 pointer-events-none">
            {nodes.map((node) => {
              // ROOT / ACTIVE PERSON
              if (node.type === 'root' && node.person) {
                const p = node.person;
                const isMale = p.gender === 'M';
                const initials = `${p.first_name?.[0] || ''}${p.last_name?.[0] || ''}`.toUpperCase();

                return (
                  <div
                    key={node.id}
                    style={{
                      position: 'absolute',
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      width: `${node.width}px`,
                    }}
                    onClick={(e) => handleNodeClick(node, e)}
                    className="pointer-events-auto flex flex-col items-center cursor-pointer group transition-transform hover:scale-105"
                    title={`Cliquer pour voir la fiche de ${p.name}`}
                  >
                    {/* Circle Profile Photo */}
                    <div
                      className={`relative w-13 h-13 rounded-full overflow-hidden shrink-0 border-3 shadow-md flex items-center justify-center font-serif font-bold text-sm text-white ${
                        isMale
                          ? 'border-[#2980b9] bg-[#2980b9]'
                          : 'border-[#c0392b] bg-[#c0392b]'
                      } ring-3 ring-[#173124]/20 group-hover:ring-[#173124]/50 transition-all`}
                    >
                      {p.photo_url ? (
                        <Image src={p.photo_url} alt={p.name} fill className="object-cover" sizes="52px" />
                      ) : (
                        initials || <User className="w-6 h-6 text-white/80" />
                      )}
                    </div>

                    {/* Small Name Frame */}
                    <div className="mt-1.5 px-3 py-0.5 bg-white rounded-xl border-2 border-[#173124] shadow-xs text-center max-w-[124px] truncate">
                      <span className="font-serif font-bold text-xs text-[#173124] block truncate">
                        {getFirstGivenName(p.first_name, p.name)}
                      </span>
                    </div>
                  </div>
                );
              }

              // SPOUSE / CONJOINT
              if (node.type === 'spouse' && node.spouse) {
                const sp = node.spouse;
                const isMale = sp.gender === 'M';
                const initials = `${sp.first_name?.[0] || ''}${sp.last_name?.[0] || ''}`.toUpperCase();

                return (
                  <div
                    key={node.id}
                    style={{
                      position: 'absolute',
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      width: `${node.width}px`,
                    }}
                    onClick={(e) => handleNodeClick(node, e)}
                    className="pointer-events-auto flex flex-col items-center cursor-pointer group transition-transform hover:scale-105"
                    title={`Cliquer pour voir la fiche de ${sp.name}`}
                  >
                    {/* Circle Profile Photo */}
                    <div
                      className={`relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2.5 shadow-md flex items-center justify-center font-serif font-bold text-xs text-white ${
                        isMale
                          ? 'border-[#2980b9] bg-[#2980b9]'
                          : 'border-[#c0392b] bg-[#c0392b]'
                      } ring-2 ring-[#c69214]/40 group-hover:ring-[#c69214] transition-all`}
                    >
                      {sp.photo_url ? (
                        <Image src={sp.photo_url} alt={sp.name} fill className="object-cover" sizes="48px" />
                      ) : (
                        initials || <User className="w-4 h-4 text-white/80" />
                      )}
                    </div>

                    {/* Small Name Frame */}
                    <div className="mt-1 px-2.5 py-0.5 bg-[#fff8f4] rounded-xl border border-[#c69214] shadow-xs text-center max-w-[120px] truncate">
                      <span className="font-serif font-bold text-xs text-[#7a5739] block truncate">
                        {getFirstGivenName(sp.first_name, sp.name)}
                      </span>
                    </div>
                  </div>
                );
              }

              // CHILD
              if (node.type === 'child' && node.child) {
                const child = node.child;
                const isMale = child.gender === 'M';
                const initials = `${child.first_name?.[0] || ''}${child.last_name?.[0] || ''}`.toUpperCase();

                return (
                  <div
                    key={node.id}
                    style={{
                      position: 'absolute',
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      width: `${node.width}px`,
                    }}
                    className="pointer-events-auto flex flex-col items-center group"
                  >
                    {/* Circle Profile Photo + Name Clickable for Detail */}
                    <div
                      onClick={(e) => handleNodeClick(node, e)}
                      className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                      title={`Cliquer pour voir la fiche de ${child.name}`}
                    >
                      <div
                        className={`relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 shadow-xs flex items-center justify-center font-serif font-bold text-xs text-white ${
                          isMale
                            ? 'border-[#2980b9] bg-[#2980b9]'
                            : 'border-[#c0392b] bg-[#c0392b]'
                        } group-hover:ring-2 group-hover:ring-[#173124]/40 transition-all`}
                      >
                        {child.photo_url ? (
                          <Image src={child.photo_url} alt={child.name} fill className="object-cover" sizes="44px" />
                        ) : (
                          initials || <User className="w-4 h-4 text-white/80" />
                        )}
                      </div>

                      {/* Small Name Frame */}
                      <div className="mt-1 px-2.5 py-0.5 bg-white rounded-xl border border-[#eae1da] shadow-2xs text-center max-w-[115px] truncate group-hover:border-[#173124]">
                        <span className="font-serif font-bold text-xs text-[#1f1b17] block truncate">
                          {getFirstGivenName(child.first_name, child.name)}
                        </span>
                      </div>
                    </div>

                    {/* Deploy Button just below the child component */}
                    {child.hasDescendants ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeployChild(child.id);
                        }}
                        className="mt-1.5 deploy-btn-shimmer bg-[#173124] hover:bg-[#2d4739] text-white rounded-lg py-1 px-2.5 font-bold text-[10px] transition-all shadow-xs flex items-center justify-center active:scale-95 cursor-pointer text-center whitespace-nowrap"
                        title={`Déployer le foyer familial de ${child.name}`}
                      >
                        <span>Déployer</span>
                      </button>
                    ) : child.isPartiallyDocumented ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeployChild(child.id);
                        }}
                        className="mt-1.5 bg-[#7a5739] hover:bg-[#5f4024] text-white rounded-lg py-0.5 px-2 font-bold text-[9px] transition-all shadow-xs flex items-center justify-center active:scale-95 cursor-pointer text-center"
                      >
                        <span>Explorer</span>
                      </button>
                    ) : null}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>

        {/* ── Person Detail Pop-up Drawer ── */}
        {selectedPerson && (
          <PersonDetailDrawer
            person={selectedPerson}
            allPersons={allPersons}
            onClose={() => setSelectedPerson(null)}
            onAddRelative={() => {
              if (onAddMemberClick) onAddMemberClick();
            }}
          />
        )}

        {/* ── Bottom Legend ── */}
        <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-xl border border-[#eae1da] shadow-md text-[9px] text-[#424844] pointer-events-none">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#2980b9]" />
            <span>Homme</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#c0392b]" />
            <span>Femme</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-0.5 bg-[#7a5739]" />
            <span>Filiation</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-0.5 border-t border-dashed border-[#c69214]" />
            <span>Alliance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
