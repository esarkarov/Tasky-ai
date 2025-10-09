import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KeyboardShortcut } from './KeyboardShortcut';

describe('Keyboard Component', () => {
  it('renders keyboard shortcuts as kbd elements', () => {
    const kbdList = ['Ctrl', 'Shift', 'P'];

    render(<KeyboardShortcut kbdList={kbdList} />);

    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('Shift')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();

    const kbdElements = screen.getAllByText(/Ctrl|Shift|P/);
    kbdElements.forEach((element) => {
      expect(element.tagName).toBe('KBD');
    });
  });

  it('renders single key shortcut', () => {
    const kbdList = ['Escape'];

    render(<KeyboardShortcut kbdList={kbdList} />);

    const escapeKey = screen.getByText('Escape');
    expect(escapeKey).toBeInTheDocument();
    expect(escapeKey.tagName).toBe('KBD');
  });

  it('includes screen reader text for accessibility', () => {
    const kbdList = ['Ctrl', 'C'];

    render(<KeyboardShortcut kbdList={kbdList} />);

    const srText = screen.getByText('Keyboard shortcut:');
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass('sr-only');
  });

  it('handles empty array', () => {
    const kbdList: string[] = [];

    render(<KeyboardShortcut kbdList={kbdList} />);

    const containerDiv = screen.getByText('Keyboard shortcut:').parentElement;
    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv?.querySelector('kbd')).not.toBeInTheDocument();
  });
});
