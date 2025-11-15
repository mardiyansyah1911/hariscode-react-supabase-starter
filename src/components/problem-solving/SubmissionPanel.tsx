import React from 'react';
import { useSubmissions } from '@/lib/api/problems';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  RefreshCw,
  Play,
  Eye,
  Code,
  Calendar,
  Trophy,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface SubmissionPanelProps {
  problemId: string;
  latestSubmission?: {
    status: 'pending' | 'running' | 'completed' | 'error' | 'timeout' | 'wrong_answer' | 'accepted';
    score?: number;
    executionTime?: number;
    memoryUsage?: number;
    errorMessage?: string;
    testResults?: {
      testCaseId: string;
      passed: boolean;
      actualOutput?: string;
      expectedOutput?: string;
      executionTime?: number;
      memoryUsage?: number;
      errorMessage?: string;
    }[];
    submittedAt: string;
    attemptNumber: number;
  };
}

export function SubmissionPanel({ problemId, latestSubmission }: SubmissionPanelProps) {
  const { data: submissions, isLoading, error } = useSubmissions(problemId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700';
      case 'wrong_answer':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700';
      case 'timeout':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100 dark:border-orange-700';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700';
      case 'pending':
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'wrong_answer':
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'timeout':
        return <Clock className="h-4 w-4" />;
      case 'pending':
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const allSubmissions = latestSubmission
    ? [latestSubmission, ...(submissions || [])]
    : submissions || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Loading submissions...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          Failed to load submissions. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pr-4">
        {/* Latest Submission Result */}
        {latestSubmission && (
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Play className="h-5 w-5" />
                Latest Submission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`${getStatusColor(latestSubmission.status)} flex items-center gap-1`}
                >
                  {getStatusIcon(latestSubmission.status)}
                  {latestSubmission.status.replace('_', ' ').toUpperCase()}
                </Badge>
                {latestSubmission.score && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    {latestSubmission.score} points
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Attempt #{latestSubmission.attemptNumber}
                </Badge>
              </div>

              {latestSubmission.executionTime && latestSubmission.memoryUsage && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {latestSubmission.executionTime}ms
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {latestSubmission.memoryUsage}MB
                  </div>
                </div>
              )}

              {latestSubmission.errorMessage && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription className="font-mono text-sm">
                    {latestSubmission.errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Test Results */}
              {latestSubmission.testResults && latestSubmission.testResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Test Results</h4>
                  <div className="space-y-2">
                    {latestSubmission.testResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2">
                          {result.passed ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-600" />
                          )}
                          <span className="text-sm">Test Case {index + 1}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{result.executionTime}ms</span>
                          <span>{result.memoryUsage}MB</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submission History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Submission History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No submissions yet</p>
                <p className="text-sm">Submit your code to see results here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allSubmissions.map((submission, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(submission.status)} flex items-center gap-1 text-xs`}
                        >
                          {getStatusIcon(submission.status)}
                          {submission.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {submission.score && (
                          <Badge variant="secondary" className="text-xs">
                            {submission.score} pts
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          Attempt #{submission.attemptNumber}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(submission.submittedAt)}
                      </div>
                    </div>

                    {(submission.executionTime || submission.memoryUsage) && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground ml-2">
                        {submission.executionTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {submission.executionTime}ms
                          </div>
                        )}
                        {submission.memoryUsage && (
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {submission.memoryUsage}MB
                          </div>
                        )}
                      </div>
                    )}

                    {index < allSubmissions.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        {allSubmissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium">Total Submissions</div>
                  <div className="text-2xl font-bold text-primary">{allSubmissions.length}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Success Rate</div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((allSubmissions.filter(s => s.status === 'accepted' || s.status === 'completed').length / allSubmissions.length) * 100)}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Best Score</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.max(...allSubmissions.map(s => s.score || 0), 0)} pts
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Avg. Time</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(allSubmissions.filter(s => s.executionTime).reduce((acc, s) => acc + (s.executionTime || 0), 0) / allSubmissions.filter(s => s.executionTime).length || 0)}ms
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