import React, { useState } from 'react';
import ChampionIcon from './ChampionIcon';

interface Position {
  row: number;
  col: number;
}

interface PositionedChampion {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  position: Position | null;
  isCarry?: boolean;
  items?: string[];
}

interface BoardPositioningProps {
  champions: PositionedChampion[];
  editable?: boolean;
  onPositionsUpdate?: (updatedChampions: PositionedChampion[]) => void;
}

const BoardPositioning: React.FC<BoardPositioningProps> = ({ champions, editable = false, onPositionsUpdate }) => {
  const [positions, setPositions] = useState(() => {
    // Initialize state with provided champion positions or default to null
    return champions.map(champion => ({
      name: champion.name,
      cost: champion.cost,
      position: champion.position || null,
      isCarry: champion.isCarry,
      items: champion.items,
    }));
  });

  const handleCellClick = (row: number, col: number) => {
    if (!editable) return;

    // Find the first unpositioned champion
    const championToPositionIndex = positions.findIndex(champ => champ.position === null);

    if (championToPositionIndex === -1) {
      alert("All champions are already positioned!");
      return;
    }

    const updatedPositions = [...positions];
    
    // Remove existing position from any champion
    const championAlreadyInPositionIndex = updatedPositions.findIndex(champ => champ.position?.row === row && champ.position?.col === col);
    if (championAlreadyInPositionIndex !== -1) {
      updatedPositions[championAlreadyInPositionIndex] = {
        ...updatedPositions[championAlreadyInPositionIndex],
        position: null,
      };
    }

    // Position the champion
    updatedPositions[championToPositionIndex] = {
      ...updatedPositions[championToPositionIndex],
      position: { row, col },
    };

    setPositions(updatedPositions);
    onPositionsUpdate?.(updatedPositions);
  };

  const handleChampionDragStart = (event: React.DragEvent<HTMLDivElement>, championName: string) => {
    event.dataTransfer.setData('championName', championName);
  };

  const handleCellDrop = (event: React.DragEvent<HTMLDivElement>, row: number, col: number) => {
    event.preventDefault();
    const championName = event.dataTransfer.getData('championName');

    const updatedPositions = [...positions];

    // Remove existing position from dragged champion
    const draggedChampionIndex = updatedPositions.findIndex(champ => champ.name === championName);
    if (draggedChampionIndex === -1) return;

    updatedPositions[draggedChampionIndex] = {
      ...updatedPositions[draggedChampionIndex],
      position: null,
    };

    // Remove existing position from any champion in the target cell
    const championAlreadyInPositionIndex = updatedPositions.findIndex(champ => champ.position?.row === row && champ.position?.col === col);
    if (championAlreadyInPositionIndex !== -1) {
      updatedPositions[championAlreadyInPositionIndex] = {
        ...updatedPositions[championAlreadyInPositionIndex],
        position: null,
      };
    }

    // Assign new position to dragged champion
    updatedPositions[draggedChampionIndex] = {
      ...updatedPositions[draggedChampionIndex],
      position: { row, col },
    };

    setPositions(updatedPositions);
    onPositionsUpdate?.(updatedPositions);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const getChampionInCell = (row: number, col: number) => {
    return positions.find(champ => champ.position?.row === row && champ.position?.col === col);
  };

  return (
    <div className="flex flex-col">
      {/* Unpositioned Champions */}
      {editable && (
        <div className="flex gap-2 mb-4">
          {positions.filter(champ => !champ.position).map(champion => (
            <div
              key={champion.name}
              draggable
              onDragStart={(e) => handleChampionDragStart(e, champion.name)}
            >
              <ChampionIcon name={champion.name} cost={champion.cost} />
            </div>
          ))}
        </div>
      )}

      {/* TFT Board */}
      <div className="tft-board-container">
        <div className="tft-board">
          <div className="tft-board-overlay"></div>
          <div className="absolute inset-0 grid grid-cols-7 grid-rows-4">
            {Array.from({ length: 4 }).map((_, row) => (
              Array.from({ length: 7 }).map((_, col) => {
                const championInCell = getChampionInCell(row, col);
                return (
                  <div
                    key={`${row}-${col}`}
                    className={`tft-board-cell ${editable ? 'tft-board-cell-editable' : ''} ${championInCell ? 'tft-board-cell-occupied' : 'tft-board-cell-empty'}`}
                    onClick={() => handleCellClick(row, col)}
                    onDrop={(e) => handleCellDrop(e, row, col)}
                    onDragOver={handleDragOver}
                  >
                    {championInCell && (
                      <ChampionIcon name={championInCell.name} cost={championInCell.cost} />
                    )}
                  </div>
                );
              })
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPositioning;
