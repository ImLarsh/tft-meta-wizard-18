
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Crown } from 'lucide-react';
import ChampionIcon from './ChampionIcon';
import ItemIcon from './ItemIcon';
import ItemSearchBar from './ItemSearchBar';
import { Champion } from '@/data/comps';

interface ChampionDetailCardProps {
  champion: Champion;
  onUpdate: (updatedChampion: Champion) => void;
  onRemove: () => void;
}

const ChampionDetailCard: React.FC<ChampionDetailCardProps> = ({ 
  champion, 
  onUpdate, 
  onRemove 
}) => {
  const items = champion.items || [];
  
  const toggleCarry = () => {
    onUpdate({
      ...champion,
      isCarry: !champion.isCarry
    });
  };
  
  const addItem = (item: string) => {
    if (items.length < 3) {
      onUpdate({
        ...champion,
        items: [...items, item]
      });
    }
  };
  
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onUpdate({
      ...champion,
      items: newItems
    });
  };
  
  return (
    <Card className="relative border border-border group">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <ChampionIcon 
            name={champion.name} 
            cost={champion.cost} 
            isCarry={champion.isCarry}
            size="md"
          />
          <div>
            <h4 className="font-medium">{champion.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Button 
                variant={champion.isCarry ? "default" : "outline"} 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={toggleCarry}
              >
                <Crown className="h-3.5 w-3.5 mr-1" />
                {champion.isCarry ? "Carry" : "Make Carry"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Items section */}
        <div className="mt-3">
          <div className="text-sm font-medium mb-2">Items</div>
          
          {/* Item search */}
          <ItemSearchBar 
            onSelectItem={addItem} 
            currentItemCount={items.length}
            placeholder="Add items..."
          />
          
          {/* Item display */}
          {items.length > 0 && (
            <div className="flex gap-2 mt-3">
              {items.map((item, index) => (
                <div key={index} className="relative group">
                  <ItemIcon name={item} />
                  <button 
                    className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeItem(index)}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChampionDetailCard;
