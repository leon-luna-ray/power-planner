import { beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

// Mock UUID for consistent testing
let mockIdCounter = 0;
vi.mock('uuid', () => ({
  v4: () => `mock-uuid-${mockIdCounter++}`
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock confirm dialog
Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true),
});

// Mock location.reload
delete (window.location as any).reload;
Object.defineProperty(window.location, 'reload', {
  value: vi.fn(),
  writable: true,
  configurable: true,
});

beforeEach(() => {
  mockIdCounter = 0;
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  vi.clearAllMocks();
});

afterEach(() => {
  // Clean up IndexedDB between tests
  indexedDB.deleteDatabase('PowerPlannerDb');
});