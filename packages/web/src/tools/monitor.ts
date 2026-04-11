import type { Tool, ToolResult } from '@dors/core';
import type { CompetitorProfile } from '../types.js';

// In-memory store for stub (will be replaced with persistent storage)
const competitors: Map<string, CompetitorProfile> = new Map();

export function createMonitorTool(): Tool {
  return {
    name: 'web_monitor',
    description: 'Monitor competitor websites for changes (pricing, features, content, design)',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['add', 'check', 'list', 'report'],
          description: 'Action: add a competitor, check for changes, list tracked competitors, or generate report',
        },
        url: { type: 'string', description: 'Competitor URL (required for add/check)' },
        name: { type: 'string', description: 'Competitor name (required for add)' },
      },
      required: ['action'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const action = args.action as string;
        const url = args.url as string | undefined;
        const name = args.name as string | undefined;

        switch (action) {
          case 'add': {
            if (!url || !name) {
              return { success: false, output: '', error: 'Both url and name are required to add a competitor' };
            }
            const profile: CompetitorProfile = {
              name,
              url,
              description: `[stub] Competitor profile for ${name}`,
              lastChecked: new Date().toISOString(),
              changes: [],
            };
            competitors.set(url, profile);
            return { success: true, output: `Added competitor: ${name} (${url})` };
          }

          case 'check': {
            if (!url) {
              return { success: false, output: '', error: 'url is required to check a competitor' };
            }
            const existing = competitors.get(url);
            if (!existing) {
              return { success: false, output: '', error: `No competitor tracked at ${url}. Use action "add" first.` };
            }
            // Stub: no real change detection
            existing.lastChecked = new Date().toISOString();
            return { success: true, output: `[stub] Checked ${existing.name} — no changes detected` };
          }

          case 'list': {
            const list = Array.from(competitors.values()).map(c => ({
              name: c.name,
              url: c.url,
              lastChecked: c.lastChecked,
              changeCount: c.changes.length,
            }));
            return { success: true, output: JSON.stringify(list, null, 2) };
          }

          case 'report': {
            const all = Array.from(competitors.values());
            const report = {
              totalCompetitors: all.length,
              competitors: all.map(c => ({
                name: c.name,
                url: c.url,
                lastChecked: c.lastChecked,
                recentChanges: c.changes.slice(-5),
              })),
              summary: `[stub] Monitoring ${all.length} competitors. No real changes detected (stub).`,
            };
            return { success: true, output: JSON.stringify(report, null, 2) };
          }

          default:
            return { success: false, output: '', error: `Unknown action: ${action}` };
        }
      } catch (error) {
        return {
          success: false,
          output: '',
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
  };
}
