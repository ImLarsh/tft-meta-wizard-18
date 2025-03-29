
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Crown } from 'lucide-react';
import ChampionIcon from './ChampionIcon';
import ItemIcon from './ItemIcon';
import ItemSearchBar from './ItemSearchBar';
import { Champion } from '@/data/comps';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [selectedItem, setSelectedItem] = useState<string>("");
  
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

  // TFT items - a basic list
  const tftItems = [
    "B.F. Sword", "Recurve Bow", "Needlessly Large Rod", "Tear of the Goddess", 
    "Chain Vest", "Negatron Cloak", "Giant's Belt", "Spatula", "Sparring Gloves",
    "Infinity Edge", "Rapid Firecannon", "Rabadon's Deathcap", "Seraph's Embrace",
    "Thornmail", "Dragon's Claw", "Warmog's Armor", "Force of Nature", "Thief's Gloves",
    "Bloodthirster", "Guinsoo's Rageblade", "Jeweled Gauntlet", "Spear of Shojin",
    "Sunfire Cape", "Quicksilver", "Morellonomicon", "Zeke's Herald", "Titan's Resolve"
  ];
  
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
          
          {/* Item selection dropdown */}
          <div className="flex gap-2 mb-3">
            <Select
              value={selectedItem}
              onValueChange={setSelectedItem}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Item" />
              </SelectTrigger>
              <SelectContent>
                {tftItems.map((item) => (
                  <SelectItem key={item} value={item}>
                    <div className="flex items-center gap-2">
                      <span>{item}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              size="sm" 
              disabled={!selectedItem || items.length >= 3}
              onClick={() => {
                if (selectedItem) {
                  addItem(selectedItem);
                  setSelectedItem("");
                }
              }}
            >
              Add
            </Button>
          </div>
          
          {/* Alternate item search */}
          <ItemSearchBar 
            onSelectItem={addItem} 
            currentItemCount={items.length}
            placeholder="Or search items..."
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
