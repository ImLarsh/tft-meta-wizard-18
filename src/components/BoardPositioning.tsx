
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
  compact?: boolean;
}

const BoardPositioning: React.FC<BoardPositioningProps> = ({ 
  champions, 
  onChange, 
  onUpdatePositions,
  readonly = false,
  compact = false
}) => {
  const [positionedChampions, setPositionedChampions] = useState<Champion[]>([]);
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    setPositionedChampions(champions || []);
  }, [champions]);

  const handleCellClick = (row: number, col: number) => {
    if (readonly) return;

    if (selectedChampion) {
      const updatedChampions = positionedChampions.map(champ => {
        if (champ === selectedChampion) {
          return { ...champ, position: { row, col } };
        }
        return champ;
      });
      
      setPositionedChampions(updatedChampions);
      setSelectedChampion(null);
      
      if (onChange) {
        onChange(updatedChampions);
      }
      
      if (onUpdatePositions) {
        onUpdatePositions(updatedChampions);
      }
    } else {
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
    
    if (onChange) {
      onChange(updatedChampions);
    }
    
    if (onUpdatePositions) {
      onUpdatePositions(updatedChampions);
    }
  };

  const renderBoard = () => {
    const rows = 4;
    const cols = 7;
    const board = [];
    
    // Flipped board: we render from rows-1 down to 0 instead of 0 up to rows-1
    for (let row = rows - 1; row >= 0; row--) {
      const rowCells = [];
      for (let col = 0; col < cols; col++) {
        const championAtPosition = positionedChampions.find(
          champ => champ.position && champ.position.row === row && champ.position.col === col
        );
        
        const isEvenRow = row % 2 === 0;
        
        const cellSize = compact ? 10 : 16;
        const hexSpacing = compact ? 1 : 2;
        
        rowCells.push(
          <div 
            key={`${row}-${col}`}
            className={`relative hexagon-cell w-${cellSize} h-${cellSize} ${
              !readonly && (!championAtPosition && selectedChampion) 
                ? 'cursor-pointer hover:bg-primary/20' 
                : ''
            } flex items-center justify-center`}
            onClick={() => handleCellClick(row, col)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, row, col)}
            style={{
              transform: isEvenRow ? `translateX(${compact ? 10 : 16}px)` : '',
              margin: `0 ${hexSpacing}px` // Add consistent horizontal spacing
            }}
          >
            <div className={`hexagon ${
              championAtPosition ? 'bg-black/70 border-champion-glow' : 'bg-black/50'
            } ${
              !readonly && selectedChampion === championAtPosition ? 'ring-2 ring-primary' : ''
            } w-full h-full`}>
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
                        <div className="hexagon-content">
                          <ChampionIcon
                            name={championAtPosition.name}
                            cost={championAtPosition.cost}
                            size={compact ? "sm" : "md"}
                            isCarry={championAtPosition.isCarry}
                            onClick={() => !readonly && handleChampionClick(championAtPosition)}
                            className="hexagon-icon"
                          />
                          {!compact && (
                            <div className="absolute bottom-1 left-0 right-0 text-center text-white text-xs font-bold text-shadow-sm">
                              {championAtPosition.name}
                            </div>
                          )}
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
          </div>
        );
      }
      board.push(
        <div key={row} className="flex gap-1 my-1">
          {rowCells}
        </div>
      );
    }
    
    return board;
  };

  return (
    <div className={`space-y-4 ${compact ? 'scale-75 origin-top-left' : ''}`}>
      <div className={`flex flex-col items-center bg-blue-950/95 p-4 rounded-md border border-blue-900/80 ${compact ? 'p-2' : ''}`}>
        {!readonly && !compact && (
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
        
        <div className={`board-container ${compact ? 'p-1' : 'p-2'} bg-blue-950/90 rounded-md`}>
          <div className="board-wrapper">
            {renderBoard()}
          </div>
        </div>
      </div>
      
      {!readonly && !compact && (
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
                draggable={!readonly}
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
