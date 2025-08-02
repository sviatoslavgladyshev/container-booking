export interface ContainerDimensions {
  width: number;
  height: number;
  length: number;
}

export interface SlotDimensions {
  width: number;
  height: number;
  length: number;
}

// Container dimensions: 6060mm × 4450mm × 2620mm
const CONTAINER_DIMENSIONS: ContainerDimensions = {
  width: 6060,
  height: 4450,
  length: 2620
};

// Standard slot dimensions: 1200mm × 1100mm × 2500mm
const STANDARD_SLOT_DIMENSIONS: SlotDimensions = {
  width: 1200,
  height: 2500,
  length: 1100
};

export function checkCargoFitsInContainer(cargoDimensions: ContainerDimensions): boolean {
  return (
    cargoDimensions.width <= CONTAINER_DIMENSIONS.width &&
    cargoDimensions.height <= CONTAINER_DIMENSIONS.height &&
    cargoDimensions.length <= CONTAINER_DIMENSIONS.length
  );
}

export function calculateRequiredSlots(cargoDimensions: ContainerDimensions): number {
  if (!checkCargoFitsInContainer(cargoDimensions)) {
    return 0; // Cargo doesn't fit in container
  }

  // Calculate how many slots needed in each dimension
  const slotsWidth = Math.ceil(cargoDimensions.width / STANDARD_SLOT_DIMENSIONS.width);
  const slotsHeight = Math.ceil(cargoDimensions.height / STANDARD_SLOT_DIMENSIONS.height);
  const slotsLength = Math.ceil(cargoDimensions.length / STANDARD_SLOT_DIMENSIONS.length);

  // For simplicity, we assume slots are arranged in a 2D grid (width x length)
  // Height is considered as stacking capability (but we only have 1 level in our visualization)
  const requiredSlots = slotsWidth * slotsLength;

  // Ensure we don't exceed the maximum number of slots in a container (20)
  return Math.min(requiredSlots, 20);
}

export function findAvailableSlotPattern(
  occupiedSlots: number[],
  requiredSlots: number,
  cargoDimensions: ContainerDimensions
): number[] {
  if (!checkCargoFitsInContainer(cargoDimensions)) {
    return [];
  }

  const slotsWidth = Math.ceil(cargoDimensions.width / STANDARD_SLOT_DIMENSIONS.width);
  const slotsLength = Math.ceil(cargoDimensions.length / STANDARD_SLOT_DIMENSIONS.length);

  // Container has 4 slots per row, 5 rows (20 total slots)
  const SLOTS_PER_ROW = 4;
  const TOTAL_ROWS = 5;

  // Create a grid to track occupied slots
  const grid = Array(TOTAL_ROWS).fill(null).map(() => Array(SLOTS_PER_ROW).fill(false));

  // Mark occupied slots
  occupiedSlots.forEach(slotId => {
    const row = Math.floor((slotId - 1) / SLOTS_PER_ROW);
    const col = (slotId - 1) % SLOTS_PER_ROW;
    if (row < TOTAL_ROWS && col < SLOTS_PER_ROW) {
      grid[row][col] = true;
    }
  });

  // Find first available rectangle that fits the cargo
  for (let row = 0; row <= TOTAL_ROWS - slotsLength; row++) {
    for (let col = 0; col <= SLOTS_PER_ROW - slotsWidth; col++) {
      let canFit = true;
      const slotsToSelect: number[] = [];

      // Check if all required slots in this rectangle are available
      for (let r = row; r < row + slotsLength; r++) {
        for (let c = col; c < col + slotsWidth; c++) {
          if (grid[r][c]) {
            canFit = false;
            break;
          }
          slotsToSelect.push(r * SLOTS_PER_ROW + c + 1);
        }
        if (!canFit) break;
      }

      if (canFit && slotsToSelect.length === requiredSlots) {
        return slotsToSelect;
      }
    }
  }

  return []; // No suitable pattern found
}

export { CONTAINER_DIMENSIONS, STANDARD_SLOT_DIMENSIONS };