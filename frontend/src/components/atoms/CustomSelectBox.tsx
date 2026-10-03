import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './atomsCSS/CustomSelectBox.css';
interface CustomSelectBoxProps {
    title: string;
    menuItems: { value: string; label: string }[];
    selectedValue: string; // 父组件传递的值
    setSelectedValue: React.Dispatch<React.SetStateAction<string>>; // 父组件的 setState
}

const CustomSelectBox: React.FC<CustomSelectBoxProps> = ({
    title,
    menuItems,
    selectedValue,
    setSelectedValue,
}) => {
    const id = useId();
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: 0 });
    const selectedIndex = menuItems.findIndex((item) => String(item.value) === selectedValue);
    const selectedLabel = menuItems[selectedIndex]?.label ?? '';
    const raisedLabel = focused || selectedValue !== '';

    const openMenu = (fromEnd = false) => {
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : fromEnd ? menuItems.length - 1 : 0);
        setOpen(true);
    };

    const chooseItem = (index: number) => {
        const item = menuItems[index];
        if (item) setSelectedValue(String(item.value));
        setOpen(false);
        triggerRef.current?.focus();
    };

    useEffect(() => {
        if (!open) return;

        const updatePosition = () => {
            const trigger = triggerRef.current;
            if (!trigger) return;
            const rect = trigger.getBoundingClientRect();
            const maxHeight = Math.max(36, window.innerHeight - 32);
            const menuHeight = Math.min(menuItems.length * 36 + 16, maxHeight);
            setMenuPosition({
                top: Math.max(16, Math.min(rect.bottom, window.innerHeight - 16 - menuHeight)),
                left: Math.max(16, Math.min(rect.left, window.innerWidth - 16 - rect.width)),
                width: rect.width,
                maxHeight,
            });
        };
        const handleOutsideClick = (event: PointerEvent) => {
            const target = event.target as Node;
            if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
                setOpen(false);
            }
        };

        updatePosition();
        document.addEventListener('pointerdown', handleOutsideClick);
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [open, menuItems.length]);

    useEffect(() => {
        if (open) menuRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }, [open, activeIndex]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Escape' || event.key === 'Tab') {
            if (event.key === 'Escape' && open) event.preventDefault();
            setOpen(false);
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) {
                openMenu(event.key === 'ArrowUp');
            } else if (menuItems.length > 0) {
                const direction = event.key === 'ArrowDown' ? 1 : -1;
                setActiveIndex((index) => (index + direction + menuItems.length) % menuItems.length);
            }
        } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            setOpen(true);
            setActiveIndex(event.key === 'Home' ? 0 : Math.max(0, menuItems.length - 1));
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (open) chooseItem(activeIndex);
            else openMenu();
        }
    };

    return (
        <div className={`custom-select-box${focused ? ' custom-select-box--focused' : ''}`}>
            <span id={`${id}-label`} className={`custom-select-label${raisedLabel ? ' custom-select-label--raised' : ''}`}>
                {title}
            </span>
            <button
                ref={triggerRef}
                type="button"
                role="combobox"
                className="custom-select-trigger"
                aria-labelledby={`${id}-label ${id}-value`}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={open ? `${id}-menu` : undefined}
                aria-activedescendant={open && menuItems[activeIndex] ? `${id}-option-${activeIndex}` : undefined}
                onClick={() => open ? setOpen(false) : openMenu()}
                onFocus={() => setFocused(true)}
                onBlur={() => { setFocused(false); setOpen(false); }}
                onKeyDown={handleKeyDown}
            >
                <span id={`${id}-value`} className="custom-select-value">{selectedLabel || '\u200b'}</span>
                <svg className={`custom-select-arrow${open ? ' custom-select-arrow--open' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m7 10 5 5 5-5z" />
                </svg>
            </button>
            <fieldset className="custom-select-outline" aria-hidden="true">
                <legend className={raisedLabel ? 'custom-select-legend--raised' : ''}><span>{title}</span></legend>
            </fieldset>
            {open && createPortal(
                <ul
                    id={`${id}-menu`}
                    ref={menuRef}
                    role="listbox"
                    aria-labelledby={`${id}-label`}
                    className="custom-select-menu"
                    style={menuPosition}
                    onPointerDown={(event) => event.preventDefault()}
                >
                    {menuItems.map((item, index) => (
                        <li
                            key={item.value}
                            id={`${id}-option-${index}`}
                            role="option"
                            aria-selected={String(item.value) === selectedValue}
                            className={`custom-select-option${activeIndex === index ? ' custom-select-option--active' : ''}`}
                            onClick={() => chooseItem(index)}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>,
                document.body,
            )}
        </div>
    );
};

export default CustomSelectBox;
