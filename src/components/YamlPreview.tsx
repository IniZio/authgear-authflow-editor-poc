import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface YamlPreviewProps {
  yaml: string;
}

export const YamlPreview: React.FC<YamlPreviewProps> = ({ yaml }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full flex flex-col border-none shadow-none rounded-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0">
        <CardTitle className="text-sm font-bold tracking-tight">YAML Output</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 gap-1.5 text-xs"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full rounded-md border bg-slate-950 p-4">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
            {yaml}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
