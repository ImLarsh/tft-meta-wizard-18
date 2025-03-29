
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import ItemIcon from '@/components/ItemIcon';

// Default TFT items - this would ideally come from a data source
const tftItems = [
  'B.F. Sword', 'Recurve Bow', 'Needlessly Large Rod', 'Tear of the Goddess', 
  'Chain Vest', 'Negatron Cloak', 'Giant\'s Belt', 'Spatula', 'Sparring Gloves',
  'Infinity Edge', 'Rapid Firecannon', 'Hextech Gunblade', 'Spear of Shojin',
  'Guardian Angel', 'Bloodthirster', 'Zeke\'s Herald', 'Titanic Hydra',
  'Runaan\'s Hurricane', 'Zz\'Rot Portal', 'Morellonomicon', 'Warmog\'s Armor',
  'Bramble Vest', 'Dragon\'s Claw', 'Zephyr', 'Sunfire Cape', 'Redemption',
  'Hand of Justice', 'Last Whisper', 'Rabadon\'s Deathcap', 'Guinsoo\'s Rageblade',
  'Statikk Shiv', 'Ionic Spark', 'Jeweled Gauntlet', 'Blue Buff', 'Frozen Heart',
  'Chalice of Power', 'Banshee\'s Claw', 'Deathblade', 'Force of Nature', 'Thief\'s Gloves',
  'Shroud of Stillness', 'Quicksilver', 'Trap Claw', 'Giant Slayer', 'Archangel\'s Staff'
];

interface ItemSearchBarProps {
  onSelectItem: (item: string) => void;
  maxItems?: number;
  currentItemCount: number;
  placeholder?: string;
}

const ItemSearchBar: React.FC<ItemSearchBarProps> = ({ 
  onSelectItem, 
  maxItems = 3, 
  currentItemCount,
  placeholder = "Search for items..." 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<string[]>(tftItems);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filtered = tftItems.filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery]);

  const handleSelectItem = (item: string) => {
    // Only check if we've reached the maximum item count
    if (currentItemCount < maxItems) {
      onSelectItem(item);
      setSearchQuery('');
      setIsOpen(false);
      // Focus back to input for quick additional searches
      inputRef.current?.focus();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pr-10"
          disabled={currentItemCount >= maxItems}
        />
        <Search className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>
      
      {isOpen && searchQuery && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-md">
          <ScrollArea className="h-56">
            <div className="p-2 space-y-1">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => handleSelectItem(item)}
                  >
                    <ItemIcon name={item} />
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No items found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {/* Item remaining counter */}
      <div className="text-xs text-muted-foreground mt-1">
        {maxItems - currentItemCount} item{maxItems - currentItemCount !== 1 ? "s" : ""} remaining
      </div>
    </div>
  );
};

export default ItemSearchBar;
