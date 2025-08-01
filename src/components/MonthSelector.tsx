import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";

interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number, year: number) => void;
}

export function MonthSelector({ selectedMonth, selectedYear, onMonthChange }: MonthSelectorProps) {
  const { t } = useTranslation();
  
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Generate next 12 months starting from current month
    for (let i = 0; i < 12; i++) {
      const month = (currentMonth + i) % 12;
      const year = currentYear + Math.floor((currentMonth + i) / 12);
      options.push({ month, year });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {t(months[selectedMonth])} {selectedYear}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
        {monthOptions.map(({ month, year }) => (
          <DropdownMenuItem 
            key={`${month}-${year}`}
            onClick={() => onMonthChange(month, year)}
            className={cn(
              selectedMonth === month && selectedYear === year ? 'bg-blue-100 text-blue-900' : '',
              'data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-900'
            )}
          >
            {t(months[month])} {year}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}