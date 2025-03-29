
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Crown, Search } from 'lucide-react';
import ChampionIcon from './ChampionIcon';
import ItemIcon from './ItemIcon';
import ItemSearchBar from './ItemSearchBar';
import { Champion } from '@/data/comps';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface ChampionDetailCardProps {
  champion: Champion;
  onUpdate: (updatedChampion: Champion) => void;
  onRemove: () => void;
}

// Full list of TFT items
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

// Categorized items for better organization
const itemCategories = {
  "Attack": ["B.F. Sword", "Infinity Edge", "Giant Slayer", "Bloodthirster", "Deathblade", "Edge of Night"],
  "Attack Speed": ["Recurve Bow", "Rapid Firecannon", "Guinsoo's Rageblade", "Runaan's Hurricane", "Statikk Shiv", "Titanic Hydra"],
  "Magic": ["Needlessly Large Rod", "Hextech Gunblade", "Archangel's Staff", "Rabadon's Deathcap", "Morellonomicon", "Jeweled Gauntlet"],
  "Mana": ["Tear of the Goddess", "Blue Buff", "Frozen Heart", "Chalice of Power", "Spear of Shojin", "Hand of Justice"],
  "Armor": ["Chain Vest", "Bramble Vest", "Gargoyle Stoneplate", "Sunfire Cape", "Shroud of Stillness", "Locket of the Iron Solari"],
  "Magic Resist": ["Negatron Cloak", "Dragon's Claw", "Quicksilver", "Zephyr", "Ionic Spark", "Runaan's Hurricane"],
  "Health": ["Giant's Belt", "Warmog's Armor", "Redemption", "Zz'Rot Portal", "Banshee's Claw", "Sunfire Cape"],
  "Special": ["Spatula", "Force of Nature", "Magnetic Remover", "Thief's Gloves", "Tactician's Crown", "Protector's Vow"],
  "Critical": ["Sparring Gloves", "Zeke's Herald", "Trap Claw", "Last Whisper", "Titan's Resolve", "Quicksilver"]
};

const ChampionDetailCard: React.FC<ChampionDetailCardProps> = ({ 
  champion, 
  onUpdate, 
  onRemove 
}) => {
  const items = champion.items || [];
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [itemSearchValue, setItemSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState(tftItems);
  
  useEffect(() => {
    if (itemSearchValue) {
      setFilteredItems(
        tftItems.filter(item => 
          item.toLowerCase().includes(itemSearchValue.toLowerCase())
        )
      );
    } else {
      setFilteredItems(tftItems);
    }
  }, [itemSearchValue]);
  
  const toggleCarry = () => {
    onUpdate({
      ...champion,
      isCarry: !champion.isCarry
    });
  };
  
  const addItem = (item: string) => {
    // Only check if we've reached the maximum item count (3), allow duplicates
    if (items.length < 3) {
      onUpdate({
        ...champion,
        items: [...items, item]
      });
      setSelectedItem(""); // Reset selection after adding
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
          
          {/* Item dropdown with categories */}
          <div className="relative mb-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  disabled={items.length >= 3}
                >
                  <span>{items.length >= 3 ? "Max items added" : "Select an item to add"}</span>
                  <span className="ml-2 opacity-70">{items.length}/3</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 max-h-[300px] overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center border rounded-md px-3 py-1 mb-2">
                    <Search className="h-4 w-4 mr-2 opacity-70" />
                    <Input 
                      value={itemSearchValue} 
                      onChange={(e) => setItemSearchValue(e.target.value)}
                      placeholder="Search items..." 
                      className="border-0 p-0 h-7 focus-visible:ring-0"
                    />
                  </div>
                </div>
                
                {itemSearchValue ? (
                  // Show flat list when searching
                  <DropdownMenuGroup>
                    {filteredItems.length > 0 ? filteredItems.map(item => (
                      <DropdownMenuItem 
                        key={item}
                        onClick={() => addItem(item)}
                        disabled={items.length >= 3}
                      >
                        {item}
                      </DropdownMenuItem>
                    )) : (
                      <div className="px-2 py-1.5 text-sm opacity-70">No items found</div>
                    )}
                  </DropdownMenuGroup>
                ) : (
                  // Show categorized items when not searching
                  Object.entries(itemCategories).map(([category, categoryItems]) => (
                    <React.Fragment key={category}>
                      <DropdownMenuLabel>{category}</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        {categoryItems.map(item => (
                          <DropdownMenuItem 
                            key={item}
                            onClick={() => addItem(item)}
                            disabled={items.length >= 3}
                          >
                            {item}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                    </React.Fragment>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Alternate item search for backward compatibility */}
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
