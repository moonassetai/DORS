import { describe, it, expect } from 'vitest';
import { createCrmExtension } from '../index.js';
import { createContactsTool } from '../tools/contacts.js';
import { createDealsTool } from '../tools/deals.js';
import { createFollowUpTool } from '../tools/followup.js';
import { createInsightsTool } from '../tools/insights.js';

describe('dors-ext-crm', () => {
  describe('extension', () => {
    it('should create extension with 4 tools', () => {
      const ext = createCrmExtension();
      expect(ext.name).toBe('dors-ext-crm');
      expect(ext.version).toBe('0.1.0');
      expect(ext.tools).toHaveLength(4);
    });

    it('should have correct tool names', () => {
      const ext = createCrmExtension();
      const names = ext.tools!.map((t) => t.name);
      expect(names).toContain('crm_contacts');
      expect(names).toContain('crm_deals');
      expect(names).toContain('crm_followup');
      expect(names).toContain('crm_insights');
    });

    it('should activate and deactivate without error', async () => {
      const ext = createCrmExtension();
      await expect(ext.activate()).resolves.toBeUndefined();
      await expect(ext.deactivate()).resolves.toBeUndefined();
    });
  });

  describe('crm_contacts', () => {
    const tool = createContactsTool();

    it('should list contacts', async () => {
      const result = await tool.execute({ action: 'list' });
      expect(result.success).toBe(true);
      expect(result.output).toContain('Hari Seldon');
      expect(result.output).toContain('Dors Venabili');
    });

    it('should get a contact by name', async () => {
      const result = await tool.execute({ action: 'get', contact: { name: 'Hari Seldon' } });
      expect(result.success).toBe(true);
      expect(result.output).toContain('hari@foundation.org');
    });

    it('should return error for unknown contact', async () => {
      const result = await tool.execute({ action: 'get', contact: { name: 'Nobody' } });
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should search contacts', async () => {
      const result = await tool.execute({ action: 'search', contact: { name: 'foundation' } });
      expect(result.success).toBe(true);
      expect(result.output).toContain('Hari Seldon');
    });

    it('should add a contact', async () => {
      const result = await tool.execute({ action: 'add', contact: { name: 'Gaal Dornick' } });
      expect(result.success).toBe(true);
      expect(result.output).toContain('Gaal Dornick');
    });

    it('should require name for add', async () => {
      const result = await tool.execute({ action: 'add', contact: {} });
      expect(result.success).toBe(false);
    });

    it('should update a contact', async () => {
      const result = await tool.execute({ action: 'update', contact: { id: 'c1' } });
      expect(result.success).toBe(true);
    });

    it('should reject unknown action', async () => {
      const result = await tool.execute({ action: 'destroy' });
      expect(result.success).toBe(false);
    });
  });

  describe('crm_deals', () => {
    const tool = createDealsTool();

    it('should list deals', async () => {
      const result = await tool.execute({ action: 'list' });
      expect(result.success).toBe(true);
      expect(result.output).toContain('Foundation Consulting');
      expect(result.output).toContain('Seldon Plan License');
    });

    it('should show pipeline summary', async () => {
      const result = await tool.execute({ action: 'pipeline' });
      expect(result.success).toBe(true);
      expect(result.output).toContain('Pipeline Summary');
      expect(result.output).toContain('Total value');
      expect(result.output).toContain('Weighted value');
    });

    it('should create a deal', async () => {
      const result = await tool.execute({ action: 'create', deal: { title: 'New Deal', stage: 'lead' } });
      expect(result.success).toBe(true);
      expect(result.output).toContain('New Deal');
    });

    it('should require title for create', async () => {
      const result = await tool.execute({ action: 'create', deal: {} });
      expect(result.success).toBe(false);
    });

    it('should move a deal stage', async () => {
      const result = await tool.execute({ action: 'move', deal: { id: 'd1', stage: 'negotiation' } });
      expect(result.success).toBe(true);
      expect(result.output).toContain('negotiation');
    });

    it('should require id and stage for move', async () => {
      const result = await tool.execute({ action: 'move', deal: { id: 'd1' } });
      expect(result.success).toBe(false);
    });
  });

  describe('crm_followup', () => {
    const tool = createFollowUpTool();

    it('should list pending follow-ups', async () => {
      const result = await tool.execute({ action: 'list' });
      expect(result.success).toBe(true);
      expect(result.output).toContain('pending follow-ups');
    });

    it('should find overdue follow-ups', async () => {
      const result = await tool.execute({ action: 'overdue' });
      expect(result.success).toBe(true);
      // Some mock items have past due dates
    });

    it('should create a follow-up', async () => {
      const result = await tool.execute({
        action: 'create',
        followup: { contactId: 'c1', description: 'Check in', type: 'email', dueDate: '2026-04-20' },
      });
      expect(result.success).toBe(true);
      expect(result.output).toContain('Check in');
    });

    it('should require contactId and description for create', async () => {
      const result = await tool.execute({ action: 'create', followup: {} });
      expect(result.success).toBe(false);
    });

    it('should complete a follow-up', async () => {
      const result = await tool.execute({ action: 'complete', followup: { id: 'f1' } });
      expect(result.success).toBe(true);
      expect(result.output).toContain('complete');
    });
  });

  describe('crm_insights', () => {
    const tool = createInsightsTool();

    it('should return pipeline health', async () => {
      const result = await tool.execute({ type: 'pipeline_health' });
      expect(result.success).toBe(true);
      expect(result.output).toContain('Pipeline Health');
    });

    it('should return activity summary', async () => {
      const result = await tool.execute({ type: 'activity_summary' });
      expect(result.success).toBe(true);
      expect(result.output).toContain('Activity Summary');
    });

    it('should return stale deals', async () => {
      const result = await tool.execute({ type: 'stale_deals' });
      expect(result.success).toBe(true);
      expect(result.output).toContain('Stale Deals');
    });

    it('should return top contacts', async () => {
      const result = await tool.execute({ type: 'top_contacts' });
      expect(result.success).toBe(true);
      expect(result.output).toContain('Top Contacts');
    });

    it('should reject unknown insight type', async () => {
      const result = await tool.execute({ type: 'unknown' });
      expect(result.success).toBe(false);
    });
  });
});
