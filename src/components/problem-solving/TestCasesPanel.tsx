import React, { useState } from 'react';
import { TestCase } from '@/lib/api/problems';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  TriangleAlert
} from 'lucide-react';
import { toast } from 'sonner';

interface TestCasesPanelProps {
  testCases: TestCase[];
  testResults?: {
    testCaseId: string;
    passed: boolean;
    actualOutput?: string;
    expectedOutput?: string;
    executionTime?: number;
    memoryUsage?: number;
    errorMessage?: string;
  }[];
}

export function TestCasesPanel({ testCases, testResults = [] }: TestCasesPanelProps) {
  const [revealedHiddenCases, setRevealedHiddenCases] = useState<Set<string>>(new Set());

  const toggleHiddenCase = (testCaseId: string) => {
    setRevealedHiddenCases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testCaseId)) {
        newSet.delete(testCaseId);
      } else {
        newSet.add(testCaseId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getTestResult = (testCaseId: string) => {
    return testResults.find(result => result.testCaseId === testCaseId);
  };

  const visibleTestCases = testCases.filter(testCase => !testCase.isHidden);
  const hiddenTestCases = testCases.filter(testCase => testCase.isHidden);
  const hasResults = testResults.length > 0;

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pr-4">
        {/* Overview */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Test Cases Overview</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {visibleTestCases.length} Public
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {hiddenTestCases.length} Hidden
              </Badge>
            </div>
            {hasResults && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {testResults.filter(r => r.passed).length} Passed
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {testResults.filter(r => !r.passed).length} Failed
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Public Test Cases */}
        {visibleTestCases.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Public Test Cases
            </h3>
            <div className="space-y-3">
              {visibleTestCases.map((testCase, index) => {
                const result = getTestResult(testCase.id);
                return (
                  <TestCaseCard
                    key={testCase.id}
                    testCase={testCase}
                    result={result}
                    index={index}
                    isHidden={false}
                    onCopyInput={() => copyToClipboard(testCase.input)}
                    onCopyOutput={() => copyToClipboard(testCase.output)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Hidden Test Cases */}
        {hiddenTestCases.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <EyeOff className="h-5 w-5" />
              Hidden Test Cases
            </h3>
            <Alert>
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription>
                Hidden test cases are used for final evaluation. You can reveal them during practice,
                but they will remain hidden in actual contests.
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              {hiddenTestCases.map((testCase, index) => {
                const result = getTestResult(testCase.id);
                const isRevealed = revealedHiddenCases.has(testCase.id);
                return (
                  <TestCaseCard
                    key={testCase.id}
                    testCase={testCase}
                    result={result}
                    index={visibleTestCases.length + index}
                    isHidden={true}
                    isRevealed={isRevealed}
                    onToggleReveal={() => toggleHiddenCase(testCase.id)}
                    onCopyInput={() => copyToClipboard(testCase.input)}
                    onCopyOutput={() => copyToClipboard(testCase.output)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Test Results Summary */}
        {hasResults && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Execution Summary</h3>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      Execution Time
                    </div>
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>Test {index + 1}</span>
                        <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                          {result.executionTime}ms
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Zap className="h-4 w-4" />
                      Memory Usage
                    </div>
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>Test {index + 1}</span>
                        <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                          {result.memoryUsage}MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

interface TestCaseCardProps {
  testCase: TestCase;
  result?: {
    passed: boolean;
    actualOutput?: string;
    expectedOutput?: string;
    executionTime?: number;
    memoryUsage?: number;
    errorMessage?: string;
  };
  index: number;
  isHidden: boolean;
  isRevealed?: boolean;
  onToggleReveal?: () => void;
  onCopyInput: () => void;
  onCopyOutput: () => void;
}

function TestCaseCard({
  testCase,
  result,
  index,
  isHidden,
  isRevealed = false,
  onToggleReveal,
  onCopyInput,
  onCopyOutput
}: TestCaseCardProps) {
  const hasResult = !!result;

  return (
    <Card className={`${hasResult ? (result.passed ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50') : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            Test Case {index + 1}
            {isHidden && (
              <Badge variant="outline" className="text-xs">
                Hidden
              </Badge>
            )}
            {hasResult && (
              result.passed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            {isHidden && onToggleReveal && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleReveal}
                className="text-xs"
              >
                {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {isRevealed ? 'Hide' : 'Reveal'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Input:</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopyInput}
              className="text-xs h-6 px-2"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          <div className="bg-muted p-3 rounded-md font-mono text-sm">
            {!isHidden || isRevealed ? (
              testCase.input
            ) : (
              <span className="text-muted-foreground italic">Hidden (click reveal to see)</span>
            )}
          </div>
        </div>

        {/* Expected Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Expected Output:</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopyOutput}
              className="text-xs h-6 px-2"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          <div className="bg-muted p-3 rounded-md font-mono text-sm">
            {!isHidden || isRevealed ? (
              testCase.output
            ) : (
              <span className="text-muted-foreground italic">Hidden (click reveal to see)</span>
            )}
          </div>
        </div>

        {/* Explanation */}
        {testCase.explanation && (!isHidden || isRevealed) && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Explanation:</div>
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md text-sm border-l-2 border-l-blue-200 dark:border-l-blue-800">
              {testCase.explanation}
            </div>
          </div>
        )}

        {/* Test Result */}
        {hasResult && (
          <div className="space-y-3 border-t pt-3">
            <div className="text-sm font-medium">Test Result:</div>

            {/* Status */}
            <div className="flex items-center gap-2 text-sm">
              {result.passed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                {result.passed ? 'Passed' : 'Failed'}
              </span>
              {result.executionTime && (
                <span className="text-muted-foreground">
                  ({result.executionTime}ms, {result.memoryUsage}MB)
                </span>
              )}
            </div>

            {/* Actual Output (if different from expected) */}
            {result.actualOutput && result.actualOutput !== testCase.output && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Your Output:</div>
                <div className="bg-red-50 dark:bg-red-950 p-3 rounded-md font-mono text-sm border-l-2 border-l-red-200 dark:border-l-red-800">
                  {result.actualOutput}
                </div>
              </div>
            )}

            {/* Error Message */}
            {result.errorMessage && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Error:</div>
                <div className="bg-red-50 dark:bg-red-950 p-3 rounded-md text-sm border-l-2 border-l-red-200 dark:border-l-red-800 font-mono">
                  {result.errorMessage}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}