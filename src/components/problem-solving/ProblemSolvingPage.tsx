import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ChevronLeft,
  Play,
  Settings,
  BookOpen,
  TestTube,
  Terminal,
  Lightbulb,
  Trophy,
  Clock,
  Zap
} from 'lucide-react';
import { useProblem, useSubmitSolution } from '@/lib/api/problems';
import { ProblemStatement } from './ProblemStatement';
import { CodeEditor } from './CodeEditor';
import { SubmissionPanel } from './SubmissionPanel';
import { TestCasesPanel } from './TestCasesPanel';
import { HintSystem } from './HintSystem';
import { toast } from 'sonner';

export function ProblemSolvingPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  // Use React Query for data fetching
  const { data: problemData, isLoading, error } = useProblem(problemId || '');
  const submitSolution = useSubmitSolution();

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    if (!problemId || !problemData) {
      toast.error('Problem data not available');
      return;
    }

    try {
      await submitSolution.mutateAsync({
        problemId,
        code,
        language: selectedLanguage
      });

      toast.success('Code submitted successfully!');
    } catch (error) {
      toast.error('Submission failed. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !problemData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Problem not found. Please check the problem ID and try again.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link to="/">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Home
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-lg font-semibold">{problemData.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={getDifficultyColor(problemData.difficulty)}
                  >
                    {problemData.difficulty}
                  </Badge>
                  <Badge variant="secondary">{problemData.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Trophy className="h-3 w-3" />
                    {problemData.points} points
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground mr-4">
                <Clock className="h-4 w-4" />
                {problemData.timeLimit}ms
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mr-4">
                <Zap className="h-4 w-4" />
                {problemData.memoryLimit}MB
              </div>
              <Button onClick={handleSubmit} disabled={submitSolution.isPending || !code.trim()}>
                <Play className="h-4 w-4 mr-2" />
                {submitSolution.isPending ? 'Running...' : 'Run Code'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <PanelGroup direction="horizontal" className="min-h-[calc(100vh-120px)]">
          {/* Left Panel - Problem Statement */}
          <Panel defaultSize={50} minSize={30}>
            <div className="pr-4 h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Problem Statement
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full overflow-hidden">
                  <Tabs defaultValue="description" className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                      <TabsTrigger value="hints">Hints</TabsTrigger>
                      <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="flex-1 overflow-auto mt-4">
                      <ProblemStatement problem={problemData} />
                    </TabsContent>

                    <TabsContent value="testcases" className="flex-1 overflow-auto mt-4">
                      <TestCasesPanel testCases={problemData.testCases} />
                    </TabsContent>

                    <TabsContent value="hints" className="flex-1 overflow-auto mt-4">
                      <HintSystem hints={problemData.hints} problemId={problemData.id} />
                    </TabsContent>

                    <TabsContent value="submissions" className="flex-1 overflow-auto mt-4">
                      <SubmissionPanel problemId={problemData.id} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-muted transition-colors cursor-col-resize" />

          {/* Right Panel - Code Editor */}
          <Panel defaultSize={50} minSize={30}>
            <div className="pl-4 h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Code Editor
                  </CardTitle>
                  <CardDescription>
                    Write your solution in {selectedLanguage}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-full overflow-hidden">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />
                </CardContent>
              </Card>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}