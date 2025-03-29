
import React, { useEffect, useState } from 'react';
import ChampionIcon from './ChampionIcon';
import { Champion } from '@/data/comps';

interface BoardPositioningProps {
  champions: Champion[];
  onChange?: (champions: Champion[]) => void;
  onUpdatePositions?: (champions: Champion[]) => void;
  readonly?: boolean;
}

const BoardPositioning: React.FC<BoardPositioningProps> = ({ 
  champions, 
  onChange, 
  onUpdatePositions,
  readonly = false 
}) => {
  const [positionedChampions, setPositionedChampions] = useState<Champion[]>([]);
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  
  // This ensures we properly handle champions with or without positions
  useEffect(() => {
    setPositionedChampions(champions);
  }, [champions]);

  const handleCellClick = (row: number, col: number) => {
    if (readonly) return;

    if (selectedChampion) {
      // Update the champion's position
      const updatedChampions = positionedChampions.map(champ => {
        if (champ === selectedChampion) {
          return { ...champ, position: { row, col } };
        }
        return champ;
      });
      
      setPositionedChampions(updatedChampions);
      setSelectedChampion(null);
      
      // Notify parent of change
      if (onChange) {
        onChange(updatedChampions);
      }
      
      // Support for the onUpdatePositions prop used in CompForm
      if (onUpdatePositions) {
        onUpdatePositions(updatedChampions);
      }
    } else {
      // Check if there's a champion at this position and select it
      const championAtPosition = positionedChampions.find(
        champ => champ.position && champ.position.row === row && champ.position.col === col
      );
      
      if (championAtPosition) {
        setSelectedChampion(championAtPosition);
      }
    }
  };

  const handleChampionClick = (champion: Champion) => {
    if (readonly) return;
    setSelectedChampion(selectedChampion === champion ? null : champion);
  };

  const renderBoard = () => {
    const rows = 4;
    const cols = 7;
    const board = [];
    
    for (let row = 0; row < rows; row++) {
      const rowCells = [];
      for (let col = 0; col < cols; col++) {
        const championAtPosition = positionedChampions.find(
          champ => champ.position && champ.position.row === row && champ.position.col === col
        );
        
        rowCells.push(
          <div 
            key={`${row}-${col}`}
            className={`relative w-12 h-12 border border-border ${
              (row + col) % 2 === 0 ? 'bg-secondary/30' : 'bg-secondary/10'
            } ${
              !readonly && (!championAtPosition && selectedChampion) 
                ? 'cursor-pointer hover:bg-primary/20' 
                : ''
            }`}
            onClick={() => handleCellClick(row, col)}
          >
            {championAtPosition && (
              <div 
                className={`absolute inset-0 flex items-center justify-center ${
                  !readonly && selectedChampion === championAtPosition ? 'ring-2 ring-primary' : ''
                }`}
              >
                <ChampionIcon
                  name={championAtPosition.name}
                  cost={championAtPosition.cost}
                  size="md"
                  isCarry={championAtPosition.isCarry}
                  onClick={() => !readonly && handleChampionClick(championAtPosition)}
                />
              </div>
            )}
          </div>
        );
      }
      board.push(
        <div key={row} className="flex">
          {rowCells}
        </div>
      );
    }
    
    return board;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        {renderBoard()}
      </div>
      
      {!readonly && (
        <div className="grid grid-cols-5 gap-2 mt-4">
          {positionedChampions.map((champion, index) => (
            <div
              key={index}
              className={`relative border border-border rounded p-1 ${
                selectedChampion === champion ? 'bg-primary/20 ring-1 ring-primary' : ''
              }`}
              onClick={() => handleChampionClick(champion)}
            >
              <div className="flex flex-col items-center">
                <ChampionIcon
                  name={champion.name}
                  cost={champion.cost}
                  size="sm"
                  isCarry={champion.isCarry}
                />
                <div className="text-xs mt-1 text-center truncate w-full">
                  {champion.name}
                </div>
                {champion.position && (
                  <div className="text-xs text-muted-foreground">
                    ({champion.position.row}, {champion.position.col})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardPositioning;
