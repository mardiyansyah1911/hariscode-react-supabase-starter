import React from 'react';
import { Problem } from '@/lib/api/problems';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Zap, Info, TriangleAlert } from 'lucide-react';

interface ProblemStatementProps {
  problem: Problem;
}

export function ProblemStatement({ problem }: ProblemStatementProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700';
    }
  };

  const renderDescription = (description: string) => {
    // Simple markdown-like rendering for code blocks
    return description.split('`').map((part, index) => {
      if (index % 2 === 1) {
        // This is a code segment (between backticks)
        return <code key={index} className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{part}</code>;
      }
      return part;
    });
  };

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6">
        {/* Problem Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              variant="outline"
              className={`${getDifficultyColor(problem.difficulty)} font-medium`}
            >
              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
            </Badge>
            <Badge variant="secondary">{problem.category}</Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {problem.timeLimit}ms
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              {problem.memoryLimit}MB
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Description</h2>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {renderDescription(problem.description)}
            </p>
          </div>
        </div>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Examples</h2>
            <div className="space-y-4">
              {problem.examples.map((example, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-4 space-y-3">
                    <div className="font-medium text-sm text-muted-foreground">
                      Example {index + 1}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground">Input:</div>
                        <div className="bg-muted p-3 rounded-md">
                          <code className="text-sm font-mono">{example.input}</code>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground">Output:</div>
                        <div className="bg-muted p-3 rounded-md">
                          <code className="text-sm font-mono">{example.output}</code>
                        </div>
                      </div>
                    </div>

                    {example.explanation && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground">Explanation:</div>
                        <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-md border-l-2 border-l-blue-200 dark:border-l-blue-800">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Constraints</h2>
            <Alert>
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <div className="space-y-2">
                  {problem.constraints.map((constraint, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-1">•</span>
                      <span>{constraint}</span>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Additional Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Clock className="h-4 w-4" />
                  Time Limit
                </div>
                <p className="text-sm text-muted-foreground">
                  Your code should complete execution within <strong>{problem.timeLimit}ms</strong>.
                  Solutions exceeding this limit will receive a "Time Limit Exceeded" error.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Zap className="h-4 w-4" />
                  Memory Limit
                </div>
                <p className="text-sm text-muted-foreground">
                  Your solution should use no more than <strong>{problem.memoryLimit}MB</strong> of memory.
                  Exceeding this limit will result in a "Memory Limit Exceeded" error.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Scoring Information */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 font-medium text-sm text-green-700 dark:text-green-300">
              <Info className="h-4 w-4" />
              Scoring
            </div>
            <p className="text-sm text-muted-foreground">
              This problem is worth <strong>{problem.points} points</strong>.
              Points are awarded based on:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Correctness of your solution</li>
              <li>• Efficiency of your algorithm</li>
              <li>• Code quality and best practices</li>
              <li>• Number of attempts (fewer attempts = higher score)</li>
            </ul>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Tips */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="font-medium text-sm">💡 Tips for Success</div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Read the problem statement carefully and understand all requirements</li>
              <li>• Start with a simple approach and optimize later if needed</li>
              <li>• Test your solution with the provided examples before submitting</li>
              <li>• Consider edge cases and boundary conditions</li>
              <li>• Use appropriate data structures for optimal performance</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}