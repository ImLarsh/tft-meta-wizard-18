
import React, { useEffect, useState } from 'react';
import ChampionIcon from './ChampionIcon';
import { Champion } from '@/data/comps';
import { MapPin } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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
  const [isDragging, setIsDragging] = useState(false);
  
  // This ensures we properly handle champions with or without positions
  useEffect(() => {
    setPositionedChampions(champions || []);
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

  const handleDragStart = (e: React.DragEvent, champion: Champion) => {
    if (readonly) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('championIndex', positionedChampions.indexOf(champion).toString());
    setIsDragging(true);
    setSelectedChampion(champion);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (readonly) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    if (readonly) return;
    e.preventDefault();
    const championIndex = parseInt(e.dataTransfer.getData('championIndex'));
    
    // Make sure we have a valid champion index
    if (isNaN(championIndex) || championIndex < 0 || championIndex >= positionedChampions.length) {
      return;
    }

    const updatedChampions = [...positionedChampions];
    updatedChampions[championIndex] = {
      ...updatedChampions[championIndex],
      position: { row, col }
    };
    
    setPositionedChampions(updatedChampions);
    setIsDragging(false);
    setSelectedChampion(null);
    
    // Notify parent of change
    if (onChange) {
      onChange(updatedChampions);
    }
    
    // Support for the onUpdatePositions prop
    if (onUpdatePositions) {
      onUpdatePositions(updatedChampions);
    }
  };

  const renderBoard = () => {
    // TFT board dimensions: 7 columns x 3 rows (hexagonal grid)
    const rows = 3;
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
            } flex items-center justify-center`}
            onClick={() => handleCellClick(row, col)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, row, col)}
          >
            {championAtPosition ? (
              <div 
                className={`absolute inset-0 flex items-center justify-center ${
                  !readonly && selectedChampion === championAtPosition ? 'ring-2 ring-primary' : ''
                }`}
                draggable={!readonly}
                onDragStart={(e) => handleDragStart(e, championAtPosition)}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <ChampionIcon
                          name={championAtPosition.name}
                          cost={championAtPosition.cost}
                          size="md"
                          isCarry={championAtPosition.isCarry}
                          onClick={() => !readonly && handleChampionClick(championAtPosition)}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{championAtPosition.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : null}
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
      <div className="flex flex-col items-center bg-card/30 p-4 rounded-md border border-border/30">
        {!readonly && (
          <div className="flex items-center mb-4 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {selectedChampion ? (
              <span>
                Place <strong>{selectedChampion.name}</strong> on the board or click another champion
              </span>
            ) : isDragging ? (
              <span>Drag champion to a position on the board</span>
            ) : (
              <span>Select a champion to position or drag directly onto the board</span>
            )}
          </div>
        )}
        
        <div className="board-container p-2 bg-card/50 rounded-md">
          <div className="board-wrapper">
            {renderBoard()}
          </div>
        </div>
      </div>
      
      {!readonly && (
        <>
          <h3 className="text-sm font-medium mt-4">Available Champions</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
            {positionedChampions.map((champion, index) => (
              <div
                key={index}
                className={`relative border border-border rounded p-2 ${
                  selectedChampion === champion ? 'bg-primary/20 ring-1 ring-primary' : 'bg-card/50'
                } ${champion.position ? 'border-primary/30' : ''}`}
                onClick={() => handleChampionClick(champion)}
                draggable
                onDragStart={(e) => handleDragStart(e, champion)}
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
                    <div className="text-xs text-primary flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-0.5" />
                      {champion.position.row},{champion.position.col}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            <p>Tip: Click a champion then click on a board position, or drag and drop directly.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default BoardPositioning;
