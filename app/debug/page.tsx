// app/test-api/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSimpleAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat/simple-test");
      const data = await response.json();
      setResult(data);
      console.log("API Test Result:", data);
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const testChatAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: 'Hello! Say "API is working!"' }],
          model: "meta-llama/llama-3.2-3b-instruct:free",
        }),
      });
      const data = await response.json();
      setResult(data);
      console.log("Chat API Result:", data);
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <div className="space-x-4 mb-6">
        <Button onClick={testSimpleAPI} disabled={loading}>
          Test Simple API
        </Button>
        <Button onClick={testChatAPI} disabled={loading} variant="outline">
          Test Chat API
        </Button>
      </div>

      {loading && <div>Loading...</div>}

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
