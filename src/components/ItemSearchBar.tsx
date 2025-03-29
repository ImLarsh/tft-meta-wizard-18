
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus } from 'lucide-react';

interface ItemSearchBarProps {
  onSelectItem: (item: string) => void;
  currentItemCount: number;
  placeholder?: string;
}

// Common TFT items
const tftItems = [
  // Basic items
  "B.F. Sword", "Recurve Bow", "Needlessly Large Rod", "Tear of the Goddess", 
  "Chain Vest", "Negatron Cloak", "Giant's Belt", "Spatula", "Sparring Gloves",
  
  // Combined items
  "Infinity Edge", "Giant Slayer", "Bloodthirster", "Deathblade", "Edge of Night",
  "Rapid Firecannon", "Guinsoo's Rageblade", "Runaan's Hurricane", "Statikk Shiv", "Titanic Hydra", 
  "Hextech Gunblade", "Archangel's Staff", "Rabadon's Deathcap", "Morellonomicon", "Jeweled Gauntlet",
  "Blue Buff", "Frozen Heart", "Chalice of Power", "Spear of Shojin", "Hand of Justice",
  "Bramble Vest", "Gargoyle Stoneplate", "Sunfire Cape", "Shroud of Stillness", "Locket of the Iron Solari",
  "Dragon's Claw", "Quicksilver", "Zephyr", "Ionic Spark", "Runaan's Hurricane",
  "Warmog's Armor", "Redemption", "Zz'Rot Portal", "Banshee's Claw", "Sunfire Cape",
  "Force of Nature", "Magnetic Remover", "Thief's Gloves", "Tactician's Crown", "Protector's Vow",
  "Zeke's Herald", "Trap Claw", "Last Whisper", "Titan's Resolve", "Quicksilver"
];

const ItemSearchBar: React.FC<ItemSearchBarProps> = ({ 
  onSelectItem, 
  currentItemCount, 
  placeholder = "Search for items..." 
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const filteredItems = searchValue.trim() === "" 
    ? [] 
    : tftItems.filter(item => 
        item.toLowerCase().includes(searchValue.toLowerCase())
      );
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsFocused(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const handleItemClick = (item: string) => {
    onSelectItem(item);
    setSearchValue("");
    setIsFocused(false);
  };
  
  return (
    <div className="relative w-full">
      <div className="flex">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={(e) => {
              e.stopPropagation();
              setIsFocused(true);
            }}
            className="pl-8"
          />
        </div>
        
        {searchValue && filteredItems.length > 0 && (
          <Button 
            type="button"
            variant="default"
            size="sm"
            className="ml-2"
            disabled={currentItemCount >= 3}
            onClick={() => handleItemClick(filteredItems[0])}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        )}
      </div>
      
      {isFocused && filteredItems.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-popover shadow-md rounded-md border border-border">
          <ScrollArea className="max-h-[200px]">
            <div className="p-1">
              {filteredItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-left h-auto py-2 px-3"
                  disabled={currentItemCount >= 3}
                  onClick={() => handleItemClick(item)}
                >
                  <span>{item}</span>
                  <Plus className="h-3.5 w-3.5 opacity-70" />
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ItemSearchBar;
