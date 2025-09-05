'use client';

import { memo, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LeaderboardEntry } from '@/types/game';
import { getLeaderboard, clearAllData, exportData, importData } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export const Leaderboard = memo(function Leaderboard({
  open,
  onOpenChange,
  className,
}: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [showDataManagement, setShowDataManagement] = useState(false);

  useEffect(() => {
    if (open) {
      setEntries(getLeaderboard());
    }
  }, [open]);

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all game data? This cannot be undone.')) {
      clearAllData();
      setEntries([]);
    }
  };

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `2048-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importData(content)) {
        setEntries(getLeaderboard());
        alert('Data imported successfully!');
      } else {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-4xl max-h-[80vh] overflow-hidden', className)}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            🏆 Leaderboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 overflow-hidden">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-lg">No scores yet!</p>
              <p className="text-sm">Play a game to see your score here.</p>
            </div>
          ) : (
            <div className="overflow-auto flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Best Tile</TableHead>
                    <TableHead className="text-right">Moves</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium text-lg">
                        {getRankEmoji(index + 1)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.playerName}
                      </TableCell>
                      <TableCell className="text-right font-bold text-blue-600">
                        {entry.score.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          'px-2 py-1 rounded text-white text-sm font-bold',
                          entry.finalTile >= 2048 ? 'bg-yellow-500' :
                          entry.finalTile >= 1024 ? 'bg-purple-500' :
                          entry.finalTile >= 512 ? 'bg-green-500' :
                          'bg-blue-500'
                        )}>
                          {entry.finalTile}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-gray-600">
                        {entry.moveCount}
                      </TableCell>
                      <TableCell className="text-right text-gray-600">
                        {formatDuration(entry.gameTime)}
                      </TableCell>
                      <TableCell className="text-right text-gray-500 text-sm">
                        {entry.timestamp.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Data Management */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDataManagement(!showDataManagement)}
              >
                Data Management {showDataManagement ? '▴' : '▾'}
              </Button>
              
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>

            {showDataManagement && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleExportData}
                    variant="outline"
                    size="sm"
                  >
                    Export Data
                  </Button>
                  
                  <div className="relative">
                    <Input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" size="sm">
                      Import Data
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleClearData}
                    variant="destructive"
                    size="sm"
                  >
                    Clear All Data
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Export your data for backup, import from a backup file, or clear all saved data.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

Leaderboard.displayName = 'Leaderboard';