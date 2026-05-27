import { BoldText, RegularText } from '@softwareone-platform/sdk-react-ui-v0/text';

import './ExtensionNavigation.scss';

interface ExtensionNavigationItem {
  href: string;
  isActive?: boolean;
  label: string;
}

interface ExtensionNavigationProps {
  ariaLabel: string;
  heading: string;
  items: ExtensionNavigationItem[];
}

export function ExtensionNavigation({ ariaLabel, heading, items }: ExtensionNavigationProps) {
  return (
    <aside className="extension-navigation" aria-label={ariaLabel}>
      <RegularText
        as="h3"
        size={1}
        color="grey-5"
        className="extension-navigation__heading"
      >
        {heading}
      </RegularText>
      <nav>
        <ul className="extension-navigation__items">
          {items.map((item) => (
            <li className="extension-navigation__item" key={item.href}>
              <a
                href={item.href}
                aria-current={item.isActive ? 'location' : undefined}
                className={
                  item.isActive
                    ? 'extension-navigation__link extension-navigation__link--active'
                    : 'extension-navigation__link'
                }
              >
                <BoldText as="span" size={2}>{item.label}</BoldText>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
