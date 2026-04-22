import type { PromptMessage, EmbeddedResource } from '@modelcontextprotocol/sdk/types.js';

export function userText(text: string): PromptMessage {
  return { role: 'user', content: { type: 'text', text } };
}

export function embed(uri: string): PromptMessage {
  const content: EmbeddedResource = {
    type: 'resource',
    resource: { uri, mimeType: 'text/markdown', text: '' },
  };
  return { role: 'user', content };
}
