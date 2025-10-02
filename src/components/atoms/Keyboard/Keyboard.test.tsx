import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Keyboard } from './Keyboard';

describe('Keyboard Component', () => {
  it('renders keyboard shortcuts as kbd elements', () => {
    const kbdList = ['Ctrl', 'Shift', 'P'];

    render(<Keyboard kbdList={kbdList} />);

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

    render(<Keyboard kbdList={kbdList} />);

    const escapeKey = screen.getByText('Escape');
    expect(escapeKey).toBeInTheDocument();
    expect(escapeKey.tagName).toBe('KBD');
  });

  it('includes screen reader text for accessibility', () => {
    const kbdList = ['Ctrl', 'C'];

    render(<Keyboard kbdList={kbdList} />);

    const srText = screen.getByText('Keyboard shortcut is,');
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass('sr-only');
  });

  it('handles empty array', () => {
    const kbdList: string[] = [];

    render(<Keyboard kbdList={kbdList} />);

    const containerDiv = screen.getByText('Keyboard shortcut is,').parentElement;
    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv?.querySelector('kbd')).not.toBeInTheDocument();
  });
});
