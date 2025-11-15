import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Lightbulb,
  Eye,
  EyeOff,
  Trophy,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'sonner';

interface HintSystemProps {
  hints: string[];
  problemId: string;
  maxHints?: number;
  pointsPerHint?: number;
}

interface HintUsage {
  problemId: string;
  revealedHints: number[];
  totalPointsDeducted: number;
  lastUsedAt: string;
}

export function HintSystem({
  hints,
  problemId,
  maxHints = 5,
  pointsPerHint = 10
}: HintSystemProps) {
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [hintUsage, setHintUsage] = useState<HintUsage | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load hint usage from localStorage on mount
  useEffect(() => {
    const savedHintUsage = localStorage.getItem(`hint_usage_${problemId}`);
    if (savedHintUsage) {
      try {
        const usage: HintUsage = JSON.parse(savedHintUsage);
        setHintUsage(usage);
        setRevealedHints(usage.revealedHints);
      } catch (error) {
        console.error('Failed to parse hint usage:', error);
      }
    }
  }, [problemId]);

  // Save hint usage to localStorage whenever it changes
  const saveHintUsage = (newRevealedHints: number[], pointsDeducted: number) => {
    const usage: HintUsage = {
      problemId,
      revealedHints: newRevealedHints,
      totalPointsDeducted: pointsDeducted,
      lastUsedAt: new Date().toISOString()
    };

    localStorage.setItem(`hint_usage_${problemId}`, JSON.stringify(usage));
    setHintUsage(usage);
  };

  const revealHint = (hintIndex: number) => {
    if (revealedHints.includes(hintIndex)) {
      return;
    }

    if (hintIndex >= maxHints || hintIndex >= hints.length) {
      toast.error('This hint is not available');
      return;
    }

    // Check if previous hint is revealed (hints must be revealed in order)
    if (hintIndex > 0 && !revealedHints.includes(hintIndex - 1)) {
      toast.error('You must reveal the previous hints first');
      return;
    }

    const newRevealedHints = [...revealedHints, hintIndex];
    const newPointsDeducted = (revealedHints.length + 1) * pointsPerHint;

    setRevealedHints(newRevealedHints);
    saveHintUsage(newRevealedHints, newPointsDeducted);

    // Show toast notifications
    toast.success(`Hint ${hintIndex + 1} revealed! -${pointsPerHint} points`, {
      description: 'Use hints wisely to maximize your score'
    });

    // Show point deduction warning if this is the first hint
    if (revealedHints.length === 0) {
      setTimeout(() => {
        toast.warning('Point Deduction Applied', {
          description: `Each hint costs ${pointsPerHint} points. Total deduction: ${newPointsDeducted} points`
        });
      }, 1000);
    }
  };

  const getPointsDeducted = () => {
    return revealedHints.length * pointsPerHint;
  };

  const getProgressPercentage = () => {
    return (revealedHints.length / maxHints) * 100;
  };

  const getHintLevelColor = (index: number) => {
    if (index === 0) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100';
    if (index === 1) return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100';
    if (index === 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100';
    if (index === 3) return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100';
    return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100';
  };

  const getHintIcon = (index: number) => {
    const icons = [Lightbulb, Target, Zap, Trophy, Unlock];
    const Icon = icons[index % icons.length];
    return <Icon className="h-4 w-4" />;
  };

  const availableHints = Math.min(maxHints, hints.length);
  const hasRevealedAll = revealedHints.length >= availableHints;
  const pointsDeducted = getPointsDeducted();

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pr-4">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Hint System
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Progress Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Hints Revealed</span>
              <span className="font-medium">
                {revealedHints.length} / {availableHints}
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />

            {pointsDeducted > 0 && (
              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <Trophy className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-sm">
                  <span className="font-medium">Point Deduction:</span> -{pointsDeducted} points
                  ({revealedHints.length} hint × {pointsPerHint} points each)
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Info Alert */}
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm">
            <span className="font-medium">How hints work:</span>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• Hints must be revealed in order</li>
              <li>• Each hint costs {pointsPerHint} points</li>
              <li>• Use them wisely to maximize your score</li>
              <li>• Hints are saved automatically for this problem</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Hints List */}
        {(isExpanded || revealedHints.length > 0) && (
          <div className="space-y-4">
            <div className="space-y-3">
              {Array.from({ length: availableHints }, (_, index) => {
                const isRevealed = revealedHints.includes(index);
                const canReveal = index === 0 || revealedHints.includes(index - 1);
                const hintText = hints[index];

                return (
                  <Card
                    key={index}
                    className={`transition-all duration-300 ${
                      isRevealed
                        ? 'border-primary bg-primary/5'
                        : canReveal
                        ? 'border-muted hover:border-primary/50 cursor-pointer'
                        : 'border-muted opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {getHintIcon(index)}
                          Hint {index + 1}
                          {isRevealed ? (
                            <Unlock className="h-4 w-4 text-green-600" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getHintLevelColor(index)}
                          >
                            {index === 0 ? 'Beginner' :
                             index === 1 ? 'Guided' :
                             index === 2 ? 'Directional' :
                             index === 3 ? 'Advanced' : 'Expert'}
                          </Badge>
                          {!isRevealed && canReveal && (
                            <Badge variant="secondary">-{pointsPerHint} pts</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {isRevealed ? (
                        <div className="space-y-2">
                          <p className="text-sm leading-relaxed">{hintText}</p>
                          {index < availableHints - 1 && (
                            <div className="text-xs text-muted-foreground italic">
                              Next hint will be more specific...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            {canReveal ? (
                              <span>Click to reveal this hint ({pointsPerHint} points)</span>
                            ) : (
                              <span>Reveal previous hints first</span>
                            )}
                          </div>
                          {canReveal && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => revealHint(index)}
                              className="w-full"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Reveal Hint
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Hints Revealed Message */}
        {hasRevealedAll && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <Trophy className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm">
              <span className="font-medium">All hints revealed!</span> You've used all available hints for this problem.
              Total points deducted: {pointsDeducted}.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        {hintUsage && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hint Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Hints Used</div>
                  <div className="font-medium">{revealedHints.length} / {availableHints}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Points Lost</div>
                  <div className="font-medium text-orange-600">{pointsDeducted}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">First Used</div>
                  <div className="font-medium">
                    {new Date(hintUsage.lastUsedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Efficiency</div>
                  <div className="font-medium">
                    {revealedHints.length === 0 ? 'Perfect' :
                     revealedHints.length <= 2 ? 'Good' :
                     revealedHints.length <= 4 ? 'Average' : 'Needs Improvement'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}