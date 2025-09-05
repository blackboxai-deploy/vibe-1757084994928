'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  className?: string;
}

export const GameControls = memo(function GameControls({ className }: GameControlsProps) {
  return (
    <Card className={cn('p-6 bg-gradient-to-br from-gray-50 to-gray-100', className)}>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 text-center">
          How to Play
        </h3>
        
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Goal:</span> Combine tiles to reach the <strong className="text-amber-600">2048</strong> tile!
          </div>
          
          <div>
            <span className="font-semibold">Rules:</span> Use arrow keys or WASD to slide tiles. When two tiles with the same number touch, they merge into one.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Keyboard Controls */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Keyboard Controls</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Move tiles:</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">↑</kbd>
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">↓</kbd>
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">←</kbd>
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">→</kbd>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Alternative:</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">W</kbd>
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">S</kbd>
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">A</kbd>
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">D</kbd>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>New game:</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Space</kbd>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Undo move:</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Z</kbd>
                  <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">U</kbd>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Pause:</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Esc</kbd>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Tips & Strategy</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>Keep your highest tile in a corner</span>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Build tiles in descending order along edges</span>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Don't chase small tiles - focus on big merges</span>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Plan several moves ahead</span>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Keep one direction (usually up) for emergencies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Milestones */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Score Milestones</h4>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center p-2 bg-blue-100 rounded">
              <div className="font-bold text-blue-600">128</div>
              <div className="text-gray-600">Good start!</div>
            </div>
            
            <div className="text-center p-2 bg-purple-100 rounded">
              <div className="font-bold text-purple-600">512</div>
              <div className="text-gray-600">Getting good!</div>
            </div>
            
            <div className="text-center p-2 bg-green-100 rounded">
              <div className="font-bold text-green-600">1024</div>
              <div className="text-gray-600">Almost there!</div>
            </div>
            
            <div className="text-center p-2 bg-yellow-100 rounded">
              <div className="font-bold text-yellow-600">2048</div>
              <div className="text-gray-600">Winner! 🏆</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

GameControls.displayName = 'GameControls';