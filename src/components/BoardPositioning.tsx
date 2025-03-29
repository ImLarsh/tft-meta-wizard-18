
import React from 'react';
import { Champion } from '@/data/comps';
import ChampionIcon from './ChampionIcon';

type Position = {
  row: number;
  col: number;
} | null;

type PositionedChampion = Champion & { position: Position };

interface BoardPositioningProps {
  champions: PositionedChampion[];
  editable?: boolean;
  onUpdatePositions?: (champions: PositionedChampion[]) => void;
}

const BoardPositioning: React.FC<BoardPositioningProps> = ({ 
  champions, 
  editable = false,
  onUpdatePositions
}) => {
  // TFT board is 7x4 (7 columns, 4 rows)
  const rows = 4;
  const cols = 7;
  
  // Create a matrix representation of the board
  const board = Array(rows).fill(null).map(() => Array(cols).fill(null));
  
  // Place champions on the board
  champions.forEach(champion => {
    if (champion.position) {
      const { row, col } = champion.position;
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        board[row][col] = champion;
      }
    }
  });
  
  // Handle dropping a champion on a cell
  const handleDrop = (event: React.DragEvent, targetRow: number, targetCol: number) => {
    if (!editable) return;
    
    event.preventDefault();
    const championId = event.dataTransfer.getData('championId');
    const updatedChampions = champions.map(champ => {
      if (champ.name === championId) {
        // Check if the target cell is already occupied
        const isOccupied = champions.some(
          c => c.position?.row === targetRow && c.position?.col === targetCol
        );
        
        if (isOccupied) {
          // If occupied, swap positions with the champion currently in that cell
          const occupyingChamp = champions.find(
            c => c.position?.row === targetRow && c.position?.col === targetCol
          );
          
          if (occupyingChamp) {
            // If the dragged champion already had a position, swap them
            if (champ.position) {
              return {
                ...champ,
                position: { row: targetRow, col: targetCol }
              };
            } else {
              // If the dragged champion didn't have a position, just place it
              return {
                ...champ,
                position: { row: targetRow, col: targetCol }
              };
            }
          }
        } else {
          // If not occupied, simply update position
          return {
            ...champ,
            position: { row: targetRow, col: targetCol }
          };
        }
      } else if (champ.position?.row === targetRow && champ.position?.col === targetCol) {
        // This is the champion being replaced, swap with the dragged champion's position
        const draggedChamp = champions.find(c => c.name === championId);
        return {
          ...champ,
          position: draggedChamp?.position || null
        };
      }
      return champ;
    });
    
    onUpdatePositions && onUpdatePositions(updatedChampions);
  };
  
  const handleDragStart = (event: React.DragEvent, champion: Champion) => {
    event.dataTransfer.setData('championId', champion.name);
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };
  
  const handleRemoveFromBoard = (championName: string) => {
    if (!editable) return;
    
    const updatedChampions = champions.map(champ => {
      if (champ.name === championName) {
        return {
          ...champ,
          position: null
        };
      }
      return champ;
    });
    
    onUpdatePositions && onUpdatePositions(updatedChampions);
  };
  
  return (
    <div className="space-y-4">
      <div className="tft-board-container">
        <div className="tft-board grid grid-cols-7 gap-1 bg-tft-dark/70 p-2 rounded-lg">
          {board.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((cell, colIndex) => (
                <div 
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`
                    w-12 h-12 rounded-md flex items-center justify-center
                    ${editable ? 'border border-dashed border-gray-500 hover:border-primary cursor-pointer' : ''}
                    ${cell ? 'bg-secondary/20' : 'bg-secondary/5'}
                  `}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                >
                  {cell && (
                    <div
                      className="relative"
                      draggable={editable}
                      onDragStart={(e) => handleDragStart(e, cell)}
                      onDoubleClick={() => editable && handleRemoveFromBoard(cell.name)}
                    >
                      <ChampionIcon name={cell.name} cost={cell.cost} size="md" />
                      {cell.isCarry && (
                        <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                          <span className="h-3 w-3 text-black text-xs flex items-center justify-center">★</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {editable && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Available Champions</h4>
          <div className="flex flex-wrap gap-2 p-2 bg-secondary/10 rounded-md">
            {champions.filter(champ => !champ.position).map((champion) => (
              <div
                key={champion.name}
                className="cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, champion)}
              >
                <ChampionIcon name={champion.name} cost={champion.cost} size="sm" />
              </div>
            ))}
            {champions.filter(champ => !champ.position).length === 0 && (
              <p className="text-sm text-muted-foreground p-2">
                All champions have been placed on the board. Double-click a champion to remove it.
              </p>
            )}
          </div>
        </div>
      )}
      
      {editable && (
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Drag and drop champions to position them. Double-click to remove from board.</p>
        </div>
      )}
    </div>
  );
};

export default BoardPositioning;
