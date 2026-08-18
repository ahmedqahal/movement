// Common watch-cell cross-reference. Silver-oxide (SR, 1.55 V) unless noted;
// a few 3 V lithium coin cells at the end for digital/AR watches. Sizes are
// diameter × height in mm. Shared by the Reference battery article and the
// Calculators battery lookup so there's a single source of truth.
export const BATTERIES = [
  { code: '337', iec: 'SR416SW', size: '4.8 × 1.65', v: '1.55', chem: 'Silver-oxide', alt: '—' },
  { code: '335', iec: 'SR512SW', size: '5.8 × 1.25', v: '1.55', chem: 'Silver-oxide', alt: '—' },
  { code: '317', iec: 'SR516SW', size: '5.8 × 1.6', v: '1.55', chem: 'Silver-oxide', alt: '—' },
  { code: '379', iec: 'SR521SW', size: '5.8 × 2.15', v: '1.55', chem: 'Silver-oxide', alt: 'AG0' },
  { code: '319', iec: 'SR527SW', size: '5.8 × 2.7', v: '1.55', chem: 'Silver-oxide', alt: '—' },
  { code: '321', iec: 'SR616SW', size: '6.8 × 1.65', v: '1.55', chem: 'Silver-oxide', alt: '—' },
  { code: '364', iec: 'SR621SW', size: '6.8 × 2.1', v: '1.55', chem: 'Silver-oxide', alt: 'AG1, 363' },
  { code: '377', iec: 'SR626SW', size: '6.8 × 2.6', v: '1.55', chem: 'Silver-oxide', alt: 'AG4, 376' },
  { code: '341', iec: 'SR714SW', size: '7.9 × 1.45', v: '1.55', chem: 'Silver-oxide', alt: '—' },
  { code: '315', iec: 'SR716SW', size: '7.9 × 1.65', v: '1.55', chem: 'Silver-oxide', alt: '—' },
  { code: '361', iec: 'SR721SW', size: '7.9 × 2.1', v: '1.55', chem: 'Silver-oxide', alt: '362, AG11' },
  { code: '397', iec: 'SR726SW', size: '7.9 × 2.6', v: '1.55', chem: 'Silver-oxide', alt: '396, AG2' },
  { code: '393', iec: 'SR754SW', size: '7.9 × 5.4', v: '1.55', chem: 'Silver-oxide', alt: '—' },
  { code: '373', iec: 'SR916SW', size: '9.5 × 1.65', v: '1.55', chem: 'Silver-oxide', alt: '—' },
  { code: '371', iec: 'SR920SW', size: '9.5 × 2.1', v: '1.55', chem: 'Silver-oxide', alt: '370 (high-drain)' },
  { code: '395', iec: 'SR927SW', size: '9.5 × 2.6', v: '1.55', chem: 'Silver-oxide', alt: '399 (high-drain), AG7' },
  { code: '394', iec: 'SR936SW', size: '9.5 × 3.6', v: '1.55', chem: 'Silver-oxide', alt: '380, AG9' },
  { code: '391', iec: 'SR1120SW', size: '11.6 × 2.05', v: '1.55', chem: 'Silver-oxide', alt: '381' },
  { code: '390', iec: 'SR1130SW', size: '11.6 × 3.05', v: '1.55', chem: 'Silver-oxide', alt: '389 (high-drain), AG10' },
  { code: '392', iec: 'SR41W', size: '7.9 × 3.6', v: '1.55', chem: 'Silver-oxide', alt: '384, AG3, LR41' },
  { code: '386', iec: 'SR43W', size: '11.6 × 4.2', v: '1.55', chem: 'Silver-oxide', alt: '301, LR43' },
  { code: '357', iec: 'SR44SW', size: '11.6 × 5.4', v: '1.55', chem: 'Silver-oxide', alt: '303, AG13, LR44' },
  { code: 'CR1616', iec: '—', size: '16 × 1.6', v: '3', chem: 'Lithium', alt: '—' },
  { code: 'CR2016', iec: '—', size: '20 × 1.6', v: '3', chem: 'Lithium', alt: '—' },
  { code: 'CR2025', iec: '—', size: '20 × 2.5', v: '3', chem: 'Lithium', alt: '—' },
  { code: 'CR2032', iec: '—', size: '20 × 3.2', v: '3', chem: 'Lithium', alt: '—' },
]
