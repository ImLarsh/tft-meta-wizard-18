
import React, { useEffect, useState } from 'react';
import ChampionIcon from './ChampionIcon';
import ItemIcon from './ItemIcon';
import { Champion } from '@/data/comps';
import { MapPin, Star } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import './TFTBoardBuilder.css';

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
          return {
            ...champ,
            position: {
              row,
              col
            }
          };
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
      position: {
        row,
        col
      }
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
    const boardPositions = [];

    for (let row = 0; row < rows; row++) {
      const rowCells = [];
      
      for (let col = 0; col < cols; col++) {
        // Skip the last cell in odd rows to maintain proper hexagon pattern
        if (row % 2 === 1 && col === cols - 1) continue;
        
        const championAtPosition = positionedChampions.find(
          champ => champ.position && champ.position.row === row && champ.position.col === col
        );
        
        rowCells.push(
          <div 
            key={`${row}-${col}`} 
            onClick={() => handleCellClick(row, col)} 
            onDragOver={handleDragOver} 
            onDrop={e => handleDrop(e, row, col)} 
            className="hex-cell"
          >
            <div className={`hex ${championAtPosition ? 'occupied' : 'empty'} ${selectedChampion === championAtPosition ? 'selected' : ''}`}>
              {championAtPosition && (
                <div 
                  className="champion-content" 
                  draggable={!readonly} 
                  onDragStart={e => handleDragStart(e, championAtPosition)}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="champion-icon-wrapper">
                          <ChampionIcon 
                            name={championAtPosition.name} 
                            cost={championAtPosition.cost} 
                            size="md" /* Changed from 'sm' to 'md' for larger icons */
                            isCarry={championAtPosition.isCarry} 
                            onClick={() => !readonly && handleChampionClick(championAtPosition)}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{championAtPosition.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {championAtPosition.items && championAtPosition.items.length > 0 && (
                    <div className="items-container">
                      {championAtPosition.items.map((item, idx) => (
                        <ItemIcon key={idx} name={item} size="sm" />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }
      
      boardPositions.push(
        <div key={row} className={`hex-row ${row % 2 === 1 ? 'offset' : ''}`}>
          {rowCells}
        </div>
      );
    }
    
    return boardPositions;
  };

  return (
    <div className={`board-wrapper ${compact ? 'compact' : ''}`}>
      {!readonly && !compact && (
        <div className="board-instructions">
          <MapPin className="h-5 w-5 mr-2" />
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
      
      <div className="board-container">
        <div className="hex-grid">
          {renderBoard()}
        </div>
      </div>
      
      {!readonly && !compact && (
        <>
          <h3 className="champions-title">Available Champions</h3>
          <div className="champions-grid">
            {positionedChampions.map((champion, index) => (
              <div 
                key={index} 
                className={`champion-card ${selectedChampion === champion ? 'selected' : ''} ${champion.position ? 'positioned' : ''}`} 
                onClick={() => handleChampionClick(champion)} 
                draggable={!readonly} 
                onDragStart={e => handleDragStart(e, champion)}
              >
                <div className="champion-info">
                  <ChampionIcon name={champion.name} cost={champion.cost} size="md" isCarry={champion.isCarry} />
                  <div className="champion-name">
                    {champion.name}
                  </div>
                  {champion.position && (
                    <div className="position-indicator">
                      <MapPin className="h-3 w-3 mr-0.5" />
                      {champion.position.row},{champion.position.col}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="board-tip">
            <p>Tip: Click a champion then click on a board position, or drag and drop directly.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default BoardPositioning;
