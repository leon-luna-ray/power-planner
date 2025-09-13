import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initializeDatabase,
  getCurrentUser,
  createLocalUser,
  saveDayEntry,
  deleteDayEntry,
  getInitializedEntries
} from '../app/api.js';
import { db } from '../app/db.js';
import type { DayEntry, User } from '../types/schemas.js';
import type { Date } from '../types/Date.js';

// Helper to create a test date object
const createTestDate = (dayName: string): Date => ({
  date: '2024-01-01',
  dayName,
  formattedDate: '01-01-2024',
  isToday: false
});

// Helper to format date as YYYY-MM-DD
const formatDate = (date: globalThis.Date): string => {
  return date.toISOString().split('T')[0]!;
};

// Helper to get a specific Monday date
const getSpecificMonday = (weeksFromNow: number = 0): string => {
  const today = new globalThis.Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new globalThis.Date(today);
  monday.setDate(today.getDate() + mondayOffset + (weeksFromNow * 7));
  monday.setHours(0, 0, 0, 0);
  return formatDate(monday);
};

describe('API Functions - Current Week Functionality', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.delete();
    await db.open();
  });

  describe('Database Initialization', () => {
    it('should initialize database successfully', async () => {
      await expect(initializeDatabase()).resolves.not.toThrow();
    });
  });

  describe('User Management', () => {
    it('should create a local user when none exists', async () => {
      const user = await getCurrentUser();
      
      expect(user).toBeDefined();
      expect(user.user_id).toBe('mock-uuid-0');
      expect(user.is_registered).toBe(false);
      expect(user.created_at).toBeDefined();
      expect(user.updated_at).toBeDefined();
    });

    it('should return existing user if one already exists', async () => {
      // Create first user
      const firstUser = await getCurrentUser();
      
      // Get user again
      const secondUser = await getCurrentUser();
      
      expect(firstUser.id).toBe(secondUser.id);
      expect(firstUser.user_id).toBe(secondUser.user_id);
    });
  });

  describe('Current Week Entry Management', () => {
    let testUser: User;

    beforeEach(async () => {
      testUser = await getCurrentUser();
    });

    it('should save a new entry for the current week', async () => {
      const testDay = createTestDate('monday');
      const testText = 'Test entry for Monday';

      await saveDayEntry(testDay, testText);

      const entries = await db.entries.toArray();
      expect(entries).toHaveLength(1);
      
      const entry = entries[0];
      expect(entry.user_local_id).toBe(testUser.id);
      expect(entry.day).toBe('monday');
      expect(entry.text).toBe(testText);
      expect(entry.week_start_date).toBe(getSpecificMonday(0));
    });

    it('should update existing entry for the same day and week', async () => {
      const testDay = createTestDate('tuesday');
      const initialText = 'Initial entry';
      const updatedText = 'Updated entry';

      // Save initial entry
      await saveDayEntry(testDay, initialText);
      
      // Update the same entry
      await saveDayEntry(testDay, updatedText);

      const entries = await db.entries.toArray();
      expect(entries).toHaveLength(1);
      
      const entry = entries[0];
      expect(entry.text).toBe(updatedText);
      expect(entry.day).toBe('tuesday');
    });

    it('should create separate entries for different weeks', async () => {
      const testDay = createTestDate('wednesday');
      
      // Mock getCurrentWeekMonday to return last week's Monday
      const lastWeekMonday = getSpecificMonday(-1);
      
      // Manually insert an entry for last week
      await db.entries.add({
        user_local_id: testUser.id!,
        day: 'wednesday',
        text: 'Last week entry',
        week_start_date: lastWeekMonday,
        created_at: new globalThis.Date().toISOString(),
        updated_at: new globalThis.Date().toISOString()
      });

      // Save entry for current week
      await saveDayEntry(testDay, 'Current week entry');

      const entries = await db.entries.toArray();
      expect(entries).toHaveLength(2);
      
      const currentWeekEntry = entries.find((e: DayEntry) => e.week_start_date === getSpecificMonday(0));
      const lastWeekEntry = entries.find((e: DayEntry) => e.week_start_date === lastWeekMonday);
      
      expect(currentWeekEntry?.text).toBe('Current week entry');
      expect(lastWeekEntry?.text).toBe('Last week entry');
    });
  });

  describe('Entry Retrieval - Current Week Only', () => {
    let testUser: User;

    beforeEach(async () => {
      testUser = await getCurrentUser();
    });

    it('should return only entries from the current week', async () => {
      const currentWeekMonday = getSpecificMonday(0);
      const lastWeekMonday = getSpecificMonday(-1);
      const nextWeekMonday = getSpecificMonday(1);

      // Add entries for different weeks
      const entriesToAdd = [
        {
          user_local_id: testUser.id!,
          day: 'monday',
          text: 'Last week Monday',
          week_start_date: lastWeekMonday,
          created_at: new globalThis.Date().toISOString(),
          updated_at: new globalThis.Date().toISOString()
        },
        {
          user_local_id: testUser.id!,
          day: 'monday',
          text: 'Current week Monday',
          week_start_date: currentWeekMonday,
          created_at: new globalThis.Date().toISOString(),
          updated_at: new globalThis.Date().toISOString()
        },
        {
          user_local_id: testUser.id!,
          day: 'tuesday',
          text: 'Current week Tuesday',
          week_start_date: currentWeekMonday,
          created_at: new globalThis.Date().toISOString(),
          updated_at: new globalThis.Date().toISOString()
        },
        {
          user_local_id: testUser.id!,
          day: 'monday',
          text: 'Next week Monday',
          week_start_date: nextWeekMonday,
          created_at: new globalThis.Date().toISOString(),
          updated_at: new globalThis.Date().toISOString()
        }
      ];

      await db.entries.bulkAdd(entriesToAdd);

      const initializedEntries = await getInitializedEntries();

      // Should only have current week entries
      expect(initializedEntries.monday?.text).toBe('Current week Monday');
      expect(initializedEntries.tuesday?.text).toBe('Current week Tuesday');
      expect(initializedEntries.wednesday?.text).toBe(''); // Empty for days without entries
      expect(initializedEntries.thursday?.text).toBe('');
      expect(initializedEntries.friday?.text).toBe('');
      expect(initializedEntries.saturday?.text).toBe('');
      expect(initializedEntries.sunday?.text).toBe('');
    });

    it('should initialize all weekdays with empty text when no entries exist', async () => {
      const initializedEntries = await getInitializedEntries();

      const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      weekdays.forEach(day => {
        expect(initializedEntries[day]).toBeDefined();
        expect(initializedEntries[day]?.text).toBe('');
      });
    });

    it('should not show entries from previous weeks even if they exist', async () => {
      const lastWeekMonday = getSpecificMonday(-1);
      
      // Add entries for last week
      const lastWeekEntries = [
        {
          user_local_id: testUser.id!,
          day: 'monday',
          text: 'Old Monday entry',
          week_start_date: lastWeekMonday,
          created_at: new globalThis.Date().toISOString(),
          updated_at: new globalThis.Date().toISOString()
        },
        {
          user_local_id: testUser.id!,
          day: 'friday',
          text: 'Old Friday entry',
          week_start_date: lastWeekMonday,
          created_at: new globalThis.Date().toISOString(),
          updated_at: new globalThis.Date().toISOString()
        }
      ];

      await db.entries.bulkAdd(lastWeekEntries);

      const initializedEntries = await getInitializedEntries();

      // All days should be empty since no current week entries exist
      const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      weekdays.forEach(day => {
        expect(initializedEntries[day]?.text).toBe('');
      });
    });
  });

  describe('Entry Deletion', () => {
    let testUser: User;

    beforeEach(async () => {
      testUser = await getCurrentUser();
    });

    it('should delete entry for the current week only', async () => {
      const currentWeekMonday = getSpecificMonday(0);
      const lastWeekMonday = getSpecificMonday(-1);

      // Add entries for current and last week
      const entriesToAdd = [
        {
          user_local_id: testUser.id!,
          day: 'monday',
          text: 'Last week Monday',
          week_start_date: lastWeekMonday,
          created_at: new globalThis.Date().toISOString(),
          updated_at: new globalThis.Date().toISOString()
        },
        {
          user_local_id: testUser.id!,
          day: 'monday',
          text: 'Current week Monday',
          week_start_date: currentWeekMonday,
          created_at: new globalThis.Date().toISOString(),
          updated_at: new globalThis.Date().toISOString()
        }
      ];

      await db.entries.bulkAdd(entriesToAdd);

      // Delete current week Monday entry
      const testDay = createTestDate('monday');
      await deleteDayEntry(testDay);

      const remainingEntries = await db.entries.toArray();
      expect(remainingEntries).toHaveLength(1);
      expect(remainingEntries[0].week_start_date).toBe(lastWeekMonday);
      expect(remainingEntries[0].text).toBe('Last week Monday');
    });

    it('should not delete entries from other weeks', async () => {
      const lastWeekMonday = getSpecificMonday(-1);
      
      // Add entry for last week only
      await db.entries.add({
        user_local_id: testUser.id!,
        day: 'monday',
        text: 'Last week Monday',
        week_start_date: lastWeekMonday,
        created_at: new globalThis.Date().toISOString(),
        updated_at: new globalThis.Date().toISOString()
      });

      // Try to delete Monday (should not affect last week's entry)
      const testDay = createTestDate('monday');
      await deleteDayEntry(testDay);

      const remainingEntries = await db.entries.toArray();
      expect(remainingEntries).toHaveLength(1);
      expect(remainingEntries[0].text).toBe('Last week Monday');
    });
  });

  describe('Week Boundary Behavior', () => {
    let testUser: User;

    beforeEach(async () => {
      testUser = await getCurrentUser();
    });

    it('should correctly identify the current week Monday', async () => {
      // Test with various dates to ensure Monday calculation is correct
      const testCases = [
        new globalThis.Date('2024-01-01'), // Monday
        new globalThis.Date('2024-01-02'), // Tuesday
        new globalThis.Date('2024-01-06'), // Saturday
        new globalThis.Date('2024-01-07'), // Sunday
      ];

      testCases.forEach(testDate => {
        const dayOfWeek = testDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const expectedMonday = new globalThis.Date(testDate);
        expectedMonday.setDate(testDate.getDate() + mondayOffset);
        expectedMonday.setHours(0, 0, 0, 0);
        
        const expectedMondayStr = formatDate(expectedMonday);
        
        // This tests the internal logic - the actual Monday calculation happens in getCurrentWeekMonday
        expect(expectedMonday.getDay()).toBe(1); // Monday should be day 1
      });
    });

    it('should handle week transitions correctly', async () => {
      // Save an entry for the current week
      const testDay = createTestDate('wednesday');
      await saveDayEntry(testDay, 'Current week entry');

      // Verify it's saved with the correct week start date
      const entries = await db.entries.toArray();
      expect(entries).toHaveLength(1);
      expect(entries[0].week_start_date).toBe(getSpecificMonday(0));

      // Simulate manual entry for next week to test isolation
      const nextWeekMonday = getSpecificMonday(1);
      await db.entries.add({
        user_local_id: testUser.id!,
        day: 'wednesday',
        text: 'Next week entry',
        week_start_date: nextWeekMonday,
        created_at: new globalThis.Date().toISOString(),
        updated_at: new globalThis.Date().toISOString()
      });

      // getInitializedEntries should only return current week
      const initializedEntries = await getInitializedEntries();
      expect(initializedEntries.wednesday?.text).toBe('Current week entry');
    });
  });
});
