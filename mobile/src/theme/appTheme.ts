import type { Organization } from '../context/AuthContext';

export const DEFAULT_BRAND_COLOR = '#F97316';

export function getAppTheme(organization?: Organization | null) {
  const brandColor = organization?.brandColor || DEFAULT_BRAND_COLOR;
  const darkMode = organization?.darkMode === true;
  const compactMode = organization?.compactMode === true;

  return {
    brandColor,
    darkMode,
    compactMode,
    statusBarStyle: darkMode ? 'light-content' as const : 'dark-content' as const,
    background: darkMode ? '#101010' : '#FBF7F2',
    surface: darkMode ? '#181818' : '#FFFFFF',
    sheet: darkMode ? '#121212' : '#F5F0EB',
    input: darkMode ? '#202020' : '#FFFFFF',
    inputMuted: darkMode ? '#1C1C1C' : '#FDFCFB',
    border: darkMode ? '#303030' : '#EDE5DC',
    strongBorder: darkMode ? '#444444' : '#C5BDB5',
    text: darkMode ? '#F8F8F8' : '#1A1209',
    mutedText: darkMode ? '#B8B8B8' : '#8A7E74',
    faintText: darkMode ? '#858585' : '#A89A8E',
    shadow: darkMode ? '#000000' : '#1A1209',
    danger: '#EF4444',
    spacing: {
      screenX: compactMode ? 16 : 20,
      contentTop: compactMode ? 14 : 20,
      cardPadding: compactMode ? 16 : 20,
      rowPaddingY: compactMode ? 10 : 14,
      optionPadding: compactMode ? 11 : 14,
      optionGap: compactMode ? 8 : 10,
      buttonPaddingY: compactMode ? 13 : 16,
      sectionGap: compactMode ? 12 : 18,
    },
  };
}

export type AppTheme = ReturnType<typeof getAppTheme>;
