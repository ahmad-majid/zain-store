/**
 * Thrift Aura — Curated Archival Products Dataset
 * Every product features:
 * - Multiple real colorways (3-4 colors each)
 * - At least 4 distinct high-resolution photography angles per colorway:
 *   [0]: Front / Hero view
 *   [1]: Side / Profile view
 *   [2]: Close-up / Texture & Fabric detail
 *   [3]: Full-body / Back / Styled silhouette
 */

export const sampleProducts = [
  {
    id: 'sp-01',
    name: 'Archival Tailored Blazer',
    description: 'Structured 90s unstructured blazer in natural Italian fibers. Features hand-stitched lapels, horn buttons, and relaxed drape. Pairs seamlessly with tailored trousers or denim.',
    price: 3400,
    original_price: 9200,
    condition: 'Like New',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    category_id: 'outerwear',
    categories: { name: 'Outerwear', slug: 'outerwear' },
    featured: true,
    colors: [
      {
        name: 'Oatmeal Linen',
        hex: '#D7C9B1',
        images: [
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Midnight Charcoal',
        hex: '#232528',
        images: [
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Vintage Camel',
        hex: '#B8860B',
        images: [
          'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Sage Olive',
        hex: '#6B7A68',
        images: [
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=900&h=1200&fit=crop&q=85',
        ],
      },
    ],
  },
  {
    id: 'sp-02',
    name: 'Bias-Cut Silk Slip Gown',
    description: 'Archival 100% mulberry silk maxi slip dress. Cut on the bias for liquid fluid drape that caresses the silhouette. Delicate adjustable straps with french seams.',
    price: 2900,
    original_price: 7800,
    condition: 'Like New',
    sizes: ['XS', 'S', 'M'],
    category_id: 'dresses',
    categories: { name: 'Dresses', slug: 'dresses' },
    featured: true,
    colors: [
      {
        name: 'Champagne Pearl',
        hex: '#F3E5D8',
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Obsidian Noir',
        hex: '#141414',
        images: [
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Burgundy Rouge',
        hex: '#5E1924',
        images: [
          'https://images.unsplash.com/photo-1562813731-e2fc35f74a4a?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop&q=85',
        ],
      },
    ],
  },
  {
    id: 'sp-03',
    name: 'Heavyweight Cotton Over-Shirt',
    description: 'Boxy workwear over-shirt crafted in thick brushed organic cotton. Double chest flap pockets, dropped shoulders, and antique brass buttons.',
    price: 1950,
    original_price: 4800,
    condition: 'Excellent',
    sizes: ['S', 'M', 'L', 'XL'],
    category_id: 'tops',
    categories: { name: 'Tops', slug: 'tops' },
    featured: true,
    colors: [
      {
        name: 'Off-White Ecru',
        hex: '#F4EFEA',
        images: [
          'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1485231183945-fffde7e1b268?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Indigo Chambray',
        hex: '#3E5C76',
        images: [
          'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1542272604-780c96856592?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Olive Drab',
        hex: '#4A533E',
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=900&h=1200&fit=crop&q=85',
        ],
      },
    ],
  },
  {
    id: 'sp-04',
    name: 'Pleated Wide-Leg Wool Trousers',
    description: 'High-waisted tailored trousers featuring deep double front pleats, slant pockets, and a fluid pooling hem. Sourced from a prestigious Savile Row vintage archive.',
    price: 2600,
    original_price: 6500,
    condition: 'Like New',
    sizes: ['XS', 'S', 'M', 'L'],
    category_id: 'bottoms',
    categories: { name: 'Bottoms', slug: 'bottoms' },
    featured: true,
    colors: [
      {
        name: 'Warm Taupe',
        hex: '#8D7B68',
        images: [
          'https://images.unsplash.com/photo-1483985988355-763728e1cde3?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Jet Black',
        hex: '#111215',
        images: [
          'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Dark Navy',
        hex: '#1B263B',
        images: [
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1483985988355-763728e1cde3?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop&q=85',
        ],
      },
    ],
  },
  {
    id: 'sp-05',
    name: 'Italian Leather Biker Jacket',
    description: 'Supple full-grain calfskin leather jacket with natural vintage patina. Heavy silver YKK hardware, snap-down notch lapels, and quilted cupro lining.',
    price: 6800,
    original_price: 24000,
    condition: 'Excellent',
    sizes: ['S', 'M', 'L'],
    category_id: 'outerwear',
    categories: { name: 'Outerwear', slug: 'outerwear' },
    featured: false,
    colors: [
      {
        name: 'Cognac Saddle',
        hex: '#8B4513',
        images: [
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Matte Black',
        hex: '#1E1E1E',
        images: [
          'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=900&h=1200&fit=crop&q=85',
        ],
      },
    ],
  },
  {
    id: 'sp-06',
    name: 'Double-Breasted Wool Trench',
    description: '100% melton wool trench coat with raglan sleeves, horn buckle waist belt, storm flap, and deep back vent. Substantial, warm, and endlessly elegant.',
    price: 7200,
    original_price: 26000,
    condition: 'Like New',
    sizes: ['S', 'M', 'L'],
    category_id: 'outerwear',
    categories: { name: 'Outerwear', slug: 'outerwear' },
    featured: false,
    colors: [
      {
        name: 'Rich Camel',
        hex: '#C19A6B',
        images: [
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Charcoal Herringbone',
        hex: '#3E3E3E',
        images: [
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=900&h=1200&fit=crop&q=85',
        ],
      },
    ],
  },
  {
    id: 'sp-07',
    name: 'Floral Chiffon Midi Dress',
    description: 'Delicate semi-sheer chiffon dress with micro floral botanical print. Smocked bodice with balloon sleeves and a flutter hem.',
    price: 2100,
    original_price: 5200,
    condition: 'Excellent',
    sizes: ['XS', 'S', 'M'],
    category_id: 'dresses',
    categories: { name: 'Dresses', slug: 'dresses' },
    featured: false,
    colors: [
      {
        name: 'Terracotta Floral',
        hex: '#C86D51',
        images: [
          'https://images.unsplash.com/photo-1562813731-e2fc35f74a4a?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Botanical Sage',
        hex: '#7A8B78',
        images: [
          'https://images.unsplash.com/photo-1596462502278-27bfdc403825?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&h=1200&fit=crop&q=85',
        ],
      },
    ],
  },
  {
    id: 'sp-08',
    name: 'Vintage 70s Suede Mini Skirt',
    description: 'Genuine pigskin suede A-line mini skirt featuring front horn snap buttons and patch pockets. Silk satin inner lining.',
    price: 2450,
    original_price: 6800,
    condition: 'Good',
    sizes: ['XS', 'S', 'M'],
    category_id: 'bottoms',
    categories: { name: 'Bottoms', slug: 'bottoms' },
    featured: false,
    colors: [
      {
        name: 'Caramel Suede',
        hex: '#9E5B32',
        images: [
          'https://images.unsplash.com/photo-1584464491033-f628bfda5bbd?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1483985988355-763728e1cde3?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop&q=85',
        ],
      },
      {
        name: 'Espresso Roast',
        hex: '#4A3525',
        images: [
          'https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=900&h=1200&fit=crop&q=85',
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&h=1200&fit=crop&q=85',
        ],
      },
    ],
  },
]
