import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  timeLimit: number;
  memoryLimit: number;
  testCases: TestCase[];
  hints: string[];
  constraints: string[];
  examples: Example[];
  authorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestCase {
  id: string;
  input: string;
  output: string;
  explanation?: string;
  isHidden?: boolean;
  problemId: string;
}

export interface Example {
  input: string;
  output: string;
  explanation: string;
}

export interface Submission {
  id: string;
  problemId: string;
  userId: string;
  code: string;
  language: string;
  status: 'pending' | 'running' | 'completed' | 'error' | 'timeout' | 'wrong_answer' | 'accepted';
  score?: number;
  executionTime?: number;
  memoryUsage?: number;
  errorMessage?: string;
  testResults?: TestResult[];
  submittedAt: string;
  attemptNumber: number;
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  actualOutput?: string;
  expectedOutput?: string;
  executionTime?: number;
  memoryUsage?: number;
  errorMessage?: string;
}

// API base URL - in production, this should come from environment variables
const API_BASE_URL = 'http://localhost:3001/api';

// Mock data for development - in production, replace with actual API calls
const mockProblems: Record<string, Problem> = {
  'two-sum': {
    id: 'two-sum',
    title: 'Two Sum',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Follow-up:** Can you come up with an algorithm that is less than \`O(n²)\` time complexity?`,
    difficulty: 'easy',
    category: 'Arrays',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    testCases: [
      {
        id: '1',
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        isHidden: false,
        problemId: 'two-sum'
      },
      {
        id: '2',
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
        isHidden: false,
        problemId: 'two-sum'
      },
      {
        id: '3',
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].',
        isHidden: true,
        problemId: 'two-sum'
      }
    ],
    hints: [
      'A brute force solution would be to check every possible pair of numbers. This would take O(n²) time.',
      'Can we use a data structure to help us find the complement faster?',
      'What if we store the numbers we\'ve seen in a hash map?',
      'We can iterate through the array and for each number, check if its complement exists in the hash map.',
      'The optimal solution runs in O(n) time with O(n) space complexity using a hash map.'
    ],
    constraints: [
      '2 <= nums.length <= 10⁴',
      '-10⁹ <= nums[i] <= 10⁹',
      '-10⁹ <= target <= 10⁹',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ]
  },
  'valid-parentheses': {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    description: `Given a string \`s\` containing just the characters \`'('\`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: 'easy',
    category: 'Stack',
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
    testCases: [
      {
        id: '1',
        input: 's = "()"',
        output: 'true',
        explanation: 'The brackets are correctly matched.',
        isHidden: false,
        problemId: 'valid-parentheses'
      },
      {
        id: '2',
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'All brackets are correctly matched in order.',
        isHidden: false,
        problemId: 'valid-parentheses'
      },
      {
        id: '3',
        input: 's = "(]"',
        output: 'false',
        explanation: 'The brackets are not matched correctly.',
        isHidden: true,
        problemId: 'valid-parentheses'
      }
    ],
    hints: [
      'Think about using a stack data structure to keep track of opening brackets.',
      'When you see a closing bracket, it should match the most recent opening bracket.',
      'You can use a hash map to map closing brackets to their corresponding opening brackets.',
      'The stack should be empty at the end for a valid string.',
      'This problem can be solved in O(n) time with O(n) space complexity.'
    ],
    constraints: [
      '1 <= s.length <= 10⁴',
      's consists of parentheses only \'()[]{}\''
    ],
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'The brackets are correctly matched.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'The brackets are not matched correctly.'
      }
    ]
  }
};

// API functions
const problemsApi = {
  // Fetch a single problem by ID
  async getProblem(problemId: string): Promise<Problem> {
    // In production, replace with actual API call:
    // const response = await fetch(`${API_BASE_URL}/problems/${problemId}`);
    // if (!response.ok) throw new Error('Problem not found');
    // return response.json();

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    const problem = mockProblems[problemId];
    if (!problem) {
      throw new Error(`Problem with ID "${problemId}" not found`);
    }

    return problem;
  },

  // Fetch all problems (for listing page)
  async getProblems(): Promise<Problem[]> {
    // In production, replace with actual API call:
    // const response = await fetch(`${API_BASE_URL}/problems`);
    // if (!response.ok) throw new Error('Failed to fetch problems');
    // return response.json();

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    return Object.values(mockProblems);
  },

  // Submit a solution
  async submitSolution(problemId: string, code: string, language: string): Promise<Submission> {
    // In production, replace with actual API call:
    // const response = await fetch(`${API_BASE_URL}/submissions`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ problemId, code, language })
    // });
    // if (!response.ok) throw new Error('Submission failed');
    // return response.json();

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate execution time

    // Simulate different submission results based on code content
    const hasMainFunction = code.includes('function twoSum') || code.includes('def two_sum') || code.includes('public int[] twoSum');
    const hasMapUsage = code.includes('Map') || code.includes('map') || code.includes('dict');

    const submission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      problemId,
      userId: 'current-user', // Would come from auth context
      code,
      language,
      status: hasMainFunction ? 'accepted' : 'wrong_answer',
      score: hasMainFunction && hasMapUsage ? 100 : hasMainFunction ? 80 : 0,
      executionTime: Math.floor(Math.random() * 100) + 50,
      memoryUsage: Math.floor(Math.random() * 50) + 20,
      testResults: [
        {
          testCaseId: '1',
          passed: hasMainFunction,
          expectedOutput: '[0,1]',
          actualOutput: hasMainFunction ? '[0,1]' : 'undefined',
          executionTime: Math.floor(Math.random() * 100) + 50,
          memoryUsage: Math.floor(Math.random() * 50) + 20
        },
        {
          testCaseId: '2',
          passed: hasMainFunction && hasMapUsage,
          expectedOutput: '[1,2]',
          actualOutput: hasMainFunction && hasMapUsage ? '[1,2]' : '[0,0]',
          executionTime: Math.floor(Math.random() * 100) + 50,
          memoryUsage: Math.floor(Math.random() * 50) + 20
        }
      ],
      submittedAt: new Date().toISOString(),
      attemptNumber: 1
    };

    return submission;
  },

  // Fetch submission history for a problem
  async getSubmissions(problemId: string): Promise<Submission[]> {
    // In production, replace with actual API call:
    // const response = await fetch(`${API_BASE_URL}/problems/${problemId}/submissions`);
    // if (!response.ok) throw new Error('Failed to fetch submissions');
    // return response.json();

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  }
};

// React Query hooks
export function useProblem(problemId: string) {
  return useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => problemsApi.getProblem(problemId),
    enabled: !!problemId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useProblems() {
  return useQuery({
    queryKey: ['problems'],
    queryFn: () => problemsApi.getProblems(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSubmitSolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ problemId, code, language }: {
      problemId: string;
      code: string;
      language: string;
    }) => problemsApi.submitSolution(problemId, code, language),
    onSuccess: (data, variables) => {
      // Invalidate related queries to refetch
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.problemId] });
      queryClient.invalidateQueries({ queryKey: ['problem', variables.problemId] });
    },
    onError: (error) => {
      console.error('Submission failed:', error);
    }
  });
}

export function useSubmissions(problemId: string) {
  return useQuery({
    queryKey: ['submissions', problemId],
    queryFn: () => problemsApi.getSubmissions(problemId),
    enabled: !!problemId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}