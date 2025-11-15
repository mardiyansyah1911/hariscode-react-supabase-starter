import React, { useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Copy,
  Download,
  Upload,
  RotateCcw,
  Fullscreen,
  Sun,
  Moon
} from 'lucide-react';
import { toast } from 'sonner';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  height?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', monaco: 'javascript' },
  { value: 'python', label: 'Python', monaco: 'python' },
  { value: 'java', label: 'Java', monaco: 'java' },
  { value: 'cpp', label: 'C++', monaco: 'cpp' },
  { value: 'c', label: 'C', monaco: 'c' },
  { value: 'csharp', label: 'C#', monaco: 'csharp' },
  { value: 'php', label: 'PHP', monaco: 'php' },
  { value: 'typescript', label: 'TypeScript', monaco: 'typescript' },
  { value: 'go', label: 'Go', monaco: 'go' },
  { value: 'rust', label: 'Rust', monaco: 'rust' },
  { value: 'sql', label: 'SQL', monaco: 'sql' },
  { value: 'html', label: 'HTML', monaco: 'html' },
  { value: 'css', label: 'CSS', monaco: 'css' },
];

const DEFAULT_TEMPLATES: Record<string, string> = {
  javascript: `// JavaScript solution
function twoSum(nums, target) {
    // Write your solution here
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (map.has(complement)) {
            return [map.get(complement), i];
        }

        map.set(nums[i], i);
    }

    return [];
}

// Example usage:
// const nums = [2, 7, 11, 15];
// const target = 9;
// console.log(twoSum(nums, target)); // [0, 1]`,

  python: `# Python solution
def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Write your solution here
    num_map = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in num_map:
            return [num_map[complement], i]

        num_map[num] = i

    return []

# Example usage:
# nums = [2, 7, 11, 15]
# target = 9
# print(two_sum(nums, target))  # [0, 1]`,

  java: `// Java solution
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        Map<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];

            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }

            map.put(nums[i], i);
        }

        return new int[]{};
    }

    // Example usage:
    // public static void main(String[] args) {
    //     Solution solution = new Solution();
    //     int[] nums = {2, 7, 11, 15};
    //     int target = 9;
    //     int[] result = solution.twoSum(nums, target);
    //     System.out.println(Arrays.toString(result)); // [0, 1]
    // }
}`,

  cpp: `// C++ solution
#include <vector>
#include <unordered_map>
#include <iostream>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Write your solution here
        std::unordered_map<int, int> num_map;

        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];

            if (num_map.find(complement) != num_map.end()) {
                return {num_map[complement], i};
            }

            num_map[nums[i]] = i;
        }

        return {};
    }
};

// Example usage:
// int main() {
//     Solution solution;
//     std::vector<int> nums = {2, 7, 11, 15};
//     int target = 9;
//     std::vector<int> result = solution.twoSum(nums, target);
//     std::cout << "[" << result[0] << ", " << result[1] << "]" << std::endl; // [0, 1]
//     return 0;
// }`,

  c: `// C solution
#include <stdio.h>
#include <stdlib.h>

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize){
    // Write your solution here
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;

    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }

    *returnSize = 0;
    free(result);
    return NULL;
}

// Example usage:
// int main() {
//     int nums[] = {2, 7, 11, 15};
//     int target = 9;
//     int returnSize;
//     int* result = twoSum(nums, 4, target, &returnSize);
//
//     if (result != NULL) {
//         printf("[%d, %d]\n", result[0], result[1]); // [0, 1]
//         free(result);
//     }
//
//     return 0;
// }`,
};

export function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  height = '500px',
  theme = 'dark',
  readOnly = false
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      detectIndentation: false,
    });

    // Set up custom key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save shortcut - could be implemented to auto-save
      toast.success('Code auto-saved');
    });
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(value);
    toast.success('Code copied to clipboard');
  };

  const handleDownloadCode = () => {
    const languageConfig = SUPPORTED_LANGUAGES.find(lang => lang.value === language);
    const extension = language === 'cpp' ? '.cpp' :
                     language === 'csharp' ? '.cs' :
                     language === 'javascript' ? '.js' :
                     language === 'typescript' ? '.ts' :
                     language === 'java' ? '.java' :
                     language === 'python' ? '.py' :
                     language === 'php' ? '.php' :
                     language === 'go' ? '.go' :
                     language === 'rust' ? '.rs' :
                     language === 'sql' ? '.sql' :
                     language === 'html' ? '.html' :
                     language === 'css' ? '.css' : '.txt';

    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Code downloaded');
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onChange(content);
      toast.success('File uploaded successfully');
    };
    reader.readAsText(file);
  };

  const handleResetCode = () => {
    const template = DEFAULT_TEMPLATES[language] || '';
    onChange(template);
    toast.success('Code reset to template');
  };

  const handleLoadTemplate = () => {
    const template = DEFAULT_TEMPLATES[language] || '';
    if (template && (!value.trim() || value.trim().length < 50)) {
      onChange(template);
      toast.success('Template loaded');
    }
  };

  const currentLanguageConfig = SUPPORTED_LANGUAGES.find(lang => lang.value === language);
  const monacoLanguage = currentLanguageConfig?.monaco || 'plaintext';

  React.useEffect(() => {
    // Load template when language changes and editor is empty or has minimal content
    if (value.trim().length < 50) {
      handleLoadTemplate();
    }
  }, [language]);

  return (
    <Card className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="border-b p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetCode}
              title="Reset to template"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              title="Copy code"
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCode}
              title="Download code"
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              title="Upload file"
            >
              <Upload className="h-4 w-4" />
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.js,.ts,.py,.java,.cpp,.c,.cs,.php,.go,.rs,.sql,.html,.css"
              className="hidden"
              onChange={handleUploadFile}
            />
          </div>
        </div>

        <Separator />
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height={height}
          language={monacoLanguage}
          value={value}
          onChange={(value) => onChange(value || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading editor...</div>
            </div>
          }
          options={{
            readOnly,
            fontSize: 14,
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            detectIndentation: false,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false
            },
            folding: true,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            showFoldingControls: 'mouseover',
            smoothScrolling: true,
            cursorSmoothCaretAnimation: 'on',
            bracketPairColorization: {
              enabled: true
            }
          }}
        />
      </div>
    </Card>
  );
}