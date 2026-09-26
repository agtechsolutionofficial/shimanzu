import t1 from '../assets/images/transparent (1).png';
import t2 from '../assets/images/transparent (2).png';
import t3 from '../assets/images/transparent (3).png';
import t4 from '../assets/images/transparent (4).png';
import t5 from '../assets/images/transparent (5).png';
import t6 from '../assets/images/transparent (6).png';
import t8 from '../assets/images/transparent (8).png';
import t9 from '../assets/images/transparent (9).png';
import t10 from '../assets/images/transparent (10).png';
import t11 from '../assets/images/transparent (11).png';
import t12 from '../assets/images/transparent (12).png';
import t13 from '../assets/images/transparent (13).png';
import t14 from '../assets/images/transparent (14).png';
import t15 from '../assets/images/transparent (15).png';
import t16 from '../assets/images/transparent (16).png';
import t17 from '../assets/images/transparent (17).png';
import t18 from '../assets/images/transparent (18).png';
import t19 from '../assets/images/transparent (19).png';
import t20 from '../assets/images/transparent (20).png';
import t21 from '../assets/images/transparent (21).png';
import t22 from '../assets/images/transparent (22).png';
import t23 from '../assets/images/transparent (23).png';
import t24 from '../assets/images/transparent (24).png';
import t25 from '../assets/images/transparent (25).png';
import t27 from '../assets/images/transparent (27).png';
import t28 from '../assets/images/transparent (28).png';
import t29 from '../assets/images/transparent (29).png';

import r777Img from '../assets/images/Shimanzu Japan Bag 3D R-777 (2).png';
import r555Img from '../assets/images/packaging/shiroikona-r-555-sq.jpeg';
import r111Img from '../assets/images/Shimanzu Japan Bag 3D R-111 F.png';
import chemicalsImg from '../assets/images/categories/chemicals.jpg';

export const PRODUCTS = [
  // 1. TEBCIN
  {
    id: 'prod-tebcin',
    name: 'TEBCIN',
    brand: 'SHIMANZU',
    chemical: 'Validamycin 5% + Tebuconazole 15% SC',
    category: 'fungicides',
    categoryLabel: 'FUNGICIDES',
    group: 'Contact + Systemic; FRAC 18 + 3',
    formulation: 'SC',
    inStock: true,
    packSizes: ['500 ml', '1 L', '5 L'],
    crops: ['Rice', 'Paddy'],
    targets: 'Sheath Blight, Rice Blast',
    dosage: '400 ml/acre',
    description: 'Dual-action fungicide combining contact and systemic activity for effective management of major fungal diseases in rice.',
    imgSrc: t1
  },

  // 2. MANGO BAR
  {
    id: 'prod-mango-bar',
    name: 'MANGO BAR',
    brand: 'SHIMANZU',
    chemical: 'Paclobutrazol 23% SC',
    category: 'at-plant',
    categoryLabel: 'AT-PLANT / PLANT GROWTH REGULATOR',
    group: 'Plant Growth Regulator; Gibberellin Biosynthesis Inhibitor',
    formulation: 'SC',
    inStock: true,
    packSizes: ['100 ml', '200 ml', '500 ml'],
    crops: ['Mango', 'Horticultural Trees'],
    targets: 'Excess vegetative growth, flowering management',
    dosage: 'As per crop age, tree size and application method',
    description: 'Paclobutrazol-based plant growth regulator that suppresses excessive vegetative growth and supports improved flowering and fruiting in mango.',
    imgSrc: t2
  },

  // 3. MAFIA Gold
  {
    id: 'prod-mafia-gold',
    name: 'MAFIA Gold',
    brand: 'SHIMANZU',
    chemical: 'Azotobacter + PSB (Phosphate Solubilizing Bacteria)',
    category: 'at-plant',
    categoryLabel: 'AT-PLANT / BIOFERTILIZER',
    group: 'Nitrogen Fixing & Phosphate Solubilizing Biofertilizer',
    formulation: 'SL',
    inStock: true,
    packSizes: ['500 g', '1 kg'],
    crops: ['Corn', 'Field Corn', 'Sweet Corn', 'Sorghum'],
    targets: 'Nutrient deficiency, poor root development and low nutrient availability',
    dosage: '400–800 g/acre',
    description: 'Microbial biofertilizer combining nitrogen-fixing Azotobacter and phosphate-solubilizing bacteria to improve nutrient availability, root development and plant growth.',
    imgSrc: t3
  },

  // 4. SHIM PYROX
  {
    id: 'prod-shim-pyrox',
    name: 'SHIM PYROX',
    brand: 'SHIMANZU',
    chemical: 'Pyroxasulfone 85% WG',
    category: 'herbicides',
    categoryLabel: 'HERBICIDES',
    group: 'Group 15; Very Long Chain Fatty Acid (VLCFA) Synthesis Inhibitor',
    formulation: 'WG',
    inStock: true,
    packSizes: ['100 g', '250 g', '500 g'],
    crops: ['Wheat', 'Maize', 'Soybean'],
    targets: 'Annual grasses and broadleaf weeds',
    dosage: 'As per crop and label recommendation',
    description: 'Pre-emergence herbicide that inhibits VLCFA synthesis and provides residual control of important annual grass and broadleaf weeds.',
    imgSrc: t4
  },

  // 5. MARKO
  {
    id: 'prod-marko',
    name: 'MARKO',
    brand: 'SHIMANZU',
    chemical: 'Pendimethalin 30% + Imazethapyr 2% EC',
    category: 'herbicides',
    categoryLabel: 'HERBICIDES',
    group: 'Group 3 + Group 2; Microtubule Assembly Inhibitor + ALS/AHAS Inhibitor',
    formulation: 'EC',
    inStock: true,
    packSizes: ['1 L', '2.5 L', '5 L'],
    crops: ['Soybean', 'Pulses'],
    targets: 'Echinochloa, Digera, Commelina, Amaranthus, Portulaca',
    dosage: '2.5–3.0 L/ha',
    description: 'Dual-mode herbicide combining residual and ALS-inhibiting activity for broad-spectrum weed management in soybean.',
    imgSrc: t5
  },

  // 6. MARKO 30
  {
    id: 'prod-marko-30',
    name: 'MARKO 30',
    brand: 'SHIMANZU',
    chemical: 'Pendimethalin 30% EC',
    category: 'herbicides',
    categoryLabel: 'HERBICIDES',
    group: 'Group 3; Microtubule Assembly Inhibitor',
    formulation: 'EC',
    inStock: true,
    packSizes: ['500 ml', '1 L', '5 L'],
    crops: ['Soybean', 'Cotton', 'Paddy', 'Wheat', 'Groundnut', 'Pigeon Pea', 'Onion'],
    targets: 'Annual grasses and broadleaf weeds',
    dosage: '1–1.6 L/acre',
    description: 'Pre-emergence herbicide providing residual control of annual grasses and broadleaf weeds across several field crops.',
    imgSrc: t6
  },

  // 7. ROMAN EXTRA
  {
    id: 'prod-roman-extra',
    name: 'ROMAN EXTRA',
    brand: 'SHIMANZU',
    chemical: 'Azoxystrobin 2.5% + Thiophanate Methyl 11.25% + Thiamethoxam 25% FS',
    category: 'insecticides',
    categoryLabel: 'INSECTICIDES & FUNGICIDES',
    group: 'FRAC 11 + FRAC 1 + IRAC 4A',
    formulation: 'FS',
    inStock: true,
    packSizes: ['250 ml', '500 ml', '1 L'],
    crops: ['Soybean', 'Cotton', 'Groundnut'],
    targets: 'Fusarium Root Rot, Phytophthora Root Rot, Rhizoctonia Seedling Blight, Pythium Seedling Blight, Shoot Fly, Termites, White Grub',
    dosage: '10 ml/kg seed',
    description: 'Seed treatment combining fungicidal and insecticidal activity to protect seeds and seedlings from soil-borne diseases and early-season insect pests.',
    imgSrc: t8
  },

  // 8. TAMRON ULTRA
  {
    id: 'prod-tamron-ultra',
    name: 'TAMRON ULTRA',
    brand: 'SHIMANZU',
    chemical: 'Thiophanate Methyl 41.7% SC',
    category: 'fungicides',
    categoryLabel: 'FUNGICIDES',
    group: 'FRAC 1; Methyl Benzimidazole Carbamate (MBC)',
    formulation: 'SC',
    inStock: true,
    packSizes: ['500 ml', '1 L'],
    crops: ['Paddy', 'Chilli', 'Groundnut'],
    targets: 'Blast, Grain Discoloration, Anthracnose, Tikka / Leaf Spot',
    dosage: '1000 ml/ha',
    description: 'Systemic fungicide providing broad-spectrum protection against several fungal diseases in rice, chilli and groundnut.',
    imgSrc: t9
  },

  // 9. HAITOR
  {
    id: 'prod-haitor',
    name: 'HAITOR',
    brand: 'SHIMANZU',
    chemical: 'Pyrithiobac Sodium 10% EC',
    category: 'herbicides',
    categoryLabel: 'HERBICIDES',
    group: 'Group 2; ALS/AHAS Inhibitor',
    formulation: 'EC',
    inStock: true,
    packSizes: ['250 ml', '500 ml'],
    crops: ['Cotton'],
    targets: 'Trianthema, Amaranthus, Chenopodium, Digera, Celosia',
    dosage: '625–750 ml/ha',
    description: 'Selective herbicide for post-emergence management of important broadleaf weeds in cotton.',
    imgSrc: t10
  },

  // 10. SHIMDOR
  {
    id: 'prod-shimdor',
    name: 'SHIMDOR',
    brand: 'SHIMANZU',
    chemical: 'Imidacloprid 17.8% SL',
    category: 'insecticides',
    categoryLabel: 'INSECTICIDES & MITICIDES',
    group: 'IRAC Group 4A; Nicotinic Acetylcholine Receptor Agonist',
    formulation: 'SL',
    inStock: true,
    packSizes: ['100 ml', '250 ml', '500 ml', '1 L'],
    crops: ['Cotton', 'Paddy', 'Chilli', 'Sugarcane', 'Mango', 'Sunflower', 'Okra', 'Citrus', 'Groundnut', 'Tomato', 'Grapes'],
    targets: 'Aphids, Whitefly, Jassids, Thrips, Hoppers, Termites, Mango Hopper, Leaf Miner, Psylla, Flea Beetle',
    dosage: 'Crop-specific dosage as per label recommendation',
    description: 'Systemic neonicotinoid insecticide providing effective control of sucking pests and selected soil and foliar insects.',
    imgSrc: t11
  },

  // 11. TUFAN
  {
    id: 'prod-tufan',
    name: 'TUFAN',
    brand: 'SHIMANZU',
    chemical: 'Lambda-Cyhalothrin 4.9% CS',
    category: 'insecticides',
    categoryLabel: 'INSECTICIDES & MITICIDES',
    group: 'IRAC Group 3A; Sodium Channel Modulator',
    formulation: 'CS',
    inStock: true,
    packSizes: ['250 ml', '500 ml', '1 L'],
    crops: ['Cotton', 'Paddy', 'Brinjal', 'Okra', 'Tomato', 'Grapes', 'Chilli', 'Soybean'],
    targets: 'Bollworms, Stem Borer, Leaf Folder, Shoot & Fruit Borer, Fruit Borer, Thrips, Flea Beetle, Pod Borer, Stem Fly, Semilooper',
    dosage: 'Crop-specific dosage as per label recommendation',
    description: 'Fast-acting pyrethroid insecticide providing contact and stomach action against a broad range of chewing and sucking insect pests.',
    imgSrc: t12
  },

  // 12. VOLVO
  {
    id: 'prod-volvo',
    name: 'VOLVO',
    brand: 'SHIMANZU',
    chemical: 'Validamycin 3% L',
    category: 'fungicides',
    categoryLabel: 'FUNGICIDES',
    group: 'Trehalase Inhibitor; Antibiotic/Fungistatic',
    formulation: 'L',
    inStock: true,
    packSizes: ['500 ml', '1 L', '2 L'],
    crops: ['Rice / Paddy'],
    targets: 'Sheath Blight',
    dosage: 'Approximately 800 ml/acre',
    description: 'Systemic-type fungicidal antibiotic used primarily for effective management of sheath blight in rice.',
    imgSrc: t13
  },

  // 13. RIDONA
  {
    id: 'prod-ridona',
    name: 'RIDONA',
    brand: 'SHIMANZU',
    chemical: 'Fipronil 15% + Chlorantraniliprole 5% SC',
    category: 'insecticides',
    categoryLabel: 'INSECTICIDES & MITICIDES',
    group: 'IRAC Group 2B + Group 28',
    formulation: 'SC',
    inStock: true,
    packSizes: ['250 ml', '500 ml', '1 L'],
    crops: ['Rice', 'Paddy'],
    targets: 'Stem Borer, Leaf Folder',
    dosage: '500 ml/ha',
    description: 'Dual-mode insecticide combining GABA-gated chloride channel and ryanodine receptor activity for effective rice pest control.',
    imgSrc: t14
  },

  // 14. AMRIT TOP
  {
    id: 'prod-amrit-top',
    name: 'AMRIT TOP',
    brand: 'SHIMANZU',
    chemical: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
    category: 'fungicides',
    categoryLabel: 'FUNGICIDES',
    group: 'FRAC Group 11 + Group 3',
    formulation: 'SC',
    inStock: true,
    packSizes: ['200 ml', '500 ml', '1 L'],
    crops: ['Chilli', 'Tomato', 'Paddy', 'Maize', 'Wheat', 'Cotton', 'Turmeric', 'Onion', 'Sugarcane'],
    targets: 'Anthracnose, Powdery Mildew, Early Blight, Late Blight, Blast, Sheath Blight, Leaf Spot, Grey Mildew, Rust, Downy Mildew, Purple Blotch, Red Rot, Smut, Leaf Blotch, Rhizome Rot',
    dosage: '200 ml/acre in 200 L water',
    description: 'Broad-spectrum systemic fungicide combining two complementary modes of action for preventive and curative disease management.',
    imgSrc: t15
  },

  // 15. HITACHI 18
  {
    id: 'prod-hitachi-18',
    name: 'HITACHI 18',
    brand: 'SHIMANZU',
    chemical: 'Fipronil 18.87% W/W SC',
    category: 'insecticides',
    categoryLabel: 'INSECTICIDES & MITICIDES',
    group: 'IRAC Group 2B; GABA-Gated Chloride Channel Inhibitor',
    formulation: 'SC',
    inStock: true,
    packSizes: ['250 ml', '500 ml', '1 L'],
    crops: ['Cotton', 'Chilli', 'Rice'],
    targets: 'Thrips, Aphids, Helicoverpa, Stem Borer, Leaf Folder, Brown Planthopper',
    dosage: 'Cotton: 375 ml/ha; Chilli: 250 ml/ha; Rice: 250 ml/ha',
    description: 'Broad-spectrum phenylpyrazole insecticide providing contact and ingestion activity against important insect pests.',
    imgSrc: t16
  },

  // 16. SYPKAR
  {
    id: 'prod-sypkar',
    name: 'SYPKAR',
    brand: 'SHIMANZU',
    chemical: 'Spiromesifen 22.9% SC',
    category: 'insecticides',
    categoryLabel: 'INSECTICIDES & MITICIDES',
    group: 'IRAC Group 23; Lipid Biosynthesis Inhibitor',
    formulation: 'SC',
    inStock: true,
    packSizes: ['200 ml', '500 ml', '1 L'],
    crops: ['Cotton', 'Brinjal', 'Chilli', 'Tomato', 'Cucumber', 'Okra', 'Tea', 'Apple'],
    targets: 'Whitefly, Whitefly Nymphs, Red Spider Mite, Chilli Yellow Mite, European Red Mite, Cucumber Mite',
    dosage: 'Crop-specific dosage as per label recommendation',
    description: 'Insecticide-acaricide targeting mites and whiteflies by disrupting lipid biosynthesis, including immature stages.',
    imgSrc: t17
  },

  // 17. FLEXA
  {
    id: 'prod-flexa',
    name: 'FLEXA',
    brand: 'SHIMANZU',
    chemical: 'Thifluzamide 24% SC',
    category: 'fungicides',
    categoryLabel: 'FUNGICIDES',
    group: 'FRAC Group 7; SDHI',
    formulation: 'SC',
    inStock: true,
    packSizes: ['150 ml', '500 ml', '1 L'],
    crops: ['Rice', 'Tomato', 'Potato'],
    targets: 'Sheath Blight, Early Blight, Black Scurf',
    dosage: 'Rice: 150 ml/acre; Tomato: 200 ml/acre; Potato: 2.5 ml/10 kg tuber',
    description: 'SDHI fungicide providing effective disease control by inhibiting fungal succinate dehydrogenase.',
    imgSrc: t18
  },

  // 18. AROBIC
  {
    id: 'prod-arobic',
    name: 'AROBIC',
    brand: 'SHIMANZU',
    chemical: 'Azoxystrobin 20% + Thifluzamide 15% w/v SC',
    category: 'fungicides',
    categoryLabel: 'FUNGICIDES',
    group: 'FRAC Group 11 + Group 7',
    formulation: 'SC',
    inStock: true,
    packSizes: ['250 ml', '500 ml', '1 L'],
    crops: ['Rice', 'Paddy'],
    targets: 'Sheath Blight, Leaf Blast',
    dosage: '500–600 ml/ha',
    description: 'Dual-mode fungicide combining QoI and SDHI activity for broad-spectrum disease management in rice.',
    imgSrc: t19
  },

  // 19. GLOSTER
  {
    id: 'prod-gloster',
    name: 'GLOSTER',
    brand: 'SHIMANZU',
    chemical: 'Azoxystrobin 11% + Tebuconazole 18.3% w/w SC',
    category: 'fungicides',
    categoryLabel: 'FUNGICIDES',
    group: 'FRAC Group 11 + Group 3',
    formulation: 'SC',
    inStock: true,
    packSizes: ['250 ml', '500 ml', '1 L'],
    crops: ['Chilli', 'Rice', 'Onion', 'Apple', 'Wheat', 'Tomato', 'Potato', 'Grapes'],
    targets: 'Fruit Rot, Powdery Mildew, Die-back, Sheath Blight, Purple Blotch, Scab, Yellow Rust, Early Blight, Late Blight, Downy Mildew',
    dosage: 'Chilli: 600 ml/ha; Rice, Onion, Wheat, Tomato, Potato, Grapes: 750 ml/ha; Apple: 1 ml/L',
    description: 'Broad-spectrum combination fungicide with systemic and protective activity against multiple fungal diseases.',
    imgSrc: t20
  },

  // 20. AMRIT
  {
    id: 'prod-amrit',
    name: 'AMRIT',
    brand: 'SHIMANZU',
    chemical: 'Azoxystrobin 23% SC',
    category: 'fungicides',
    categoryLabel: 'FUNGICIDES',
    group: 'FRAC Group 11; QoI Fungicide',
    formulation: 'SC',
    inStock: true,
    packSizes: ['250 ml', '500 ml', '1 L'],
    crops: ['Grapes', 'Chilli', 'Mango', 'Tomato', 'Potato', 'Cucumber', 'Cumin', 'Pomegranate'],
    targets: 'Downy Mildew, Powdery Mildew, Anthracnose, Fruit Rot, Early Blight, Late Blight, Leaf Spot, Fruit Spot',
    dosage: '500 ml/ha; Mango: 100 ml/100 L water',
    description: 'Systemic QoI fungicide providing preventive and curative activity against a broad range of fungal diseases.',
    imgSrc: t21
  },

  // 21. MENTION
  {
    id: 'prod-mention',
    name: 'MENTION',
    brand: 'SHIMANZU',
    chemical: 'Metolachlor 50% EC',
    category: 'herbicides',
    categoryLabel: 'HERBICIDES',
    group: 'Group 15; VLCFA Synthesis Inhibitor',
    formulation: 'EC',
    inStock: true,
    packSizes: ['500 ml', '1 L', '5 L'],
    crops: ['Soybean', 'Pulses'],
    targets: 'Echinochloa colona, Eleusine, Digitaria, Dactyloctenium, Panicum, Cyperus, Amaranthus',
    dosage: '2 L/ha',
    description: 'Pre-emergence residual herbicide providing control of annual grasses, sedges and selected broadleaf weeds in soybean.',
    imgSrc: t22
  },

  // 22. GLUFIRE
  {
    id: 'prod-glufire',
    name: 'GLUFIRE',
    brand: 'SHIMANZU',
    chemical: 'Glufosinate Ammonium 13.5% SL (15% w/v)',
    category: 'herbicides',
    categoryLabel: 'HERBICIDES',
    group: 'Group 10; Glutamine Synthetase Inhibitor',
    formulation: 'SL',
    inStock: true,
    packSizes: ['500 ml', '1 L', '5 L'],
    crops: ['Cotton', 'Tea'],
    targets: 'Echinochloa, Cynodon, Cyperus, Digitaria, Dactyloctenium, Imperata, Commelina, Ageratum, Eleusine, Paspalum',
    dosage: 'Cotton: 2.5–3 L/ha; Tea: 2.5–3.3 L/ha',
    description: 'Non-selective herbicide that inhibits glutamine synthetase and provides broad-spectrum control of grasses, sedges and broadleaf weeds.',
    imgSrc: t23
  },

  // 23. GLYMAX
  {
    id: 'prod-glymax',
    name: 'GLYMAX',
    brand: 'SHIMANZU',
    chemical: 'Glyphosate 41% SL (Isopropylamine Salt)',
    category: 'herbicides',
    categoryLabel: 'HERBICIDES',
    group: 'Group 9; EPSPS Inhibitor',
    formulation: 'SL',
    inStock: true,
    packSizes: ['500 ml', '1 L', '5 L'],
    crops: ['Tea', 'Non-Cropped Areas'],
    targets: 'Sorghum halepense, Cynodon, Cyperus, Echinochloa, Trianthema, Ageratum, Parthenium, Amaranthus, Digitaria',
    dosage: '2–3 L/ha',
    description: 'Systemic non-selective herbicide that inhibits EPSPS and controls a wide range of annual and perennial weeds.',
    imgSrc: t24
  },

  // 24. FITLO 58
  {
    id: 'prod-fitlo-58',
    name: 'FITLO 58',
    brand: 'SHIMANZU',
    chemical: '2,4-D Amine Salt 58% SL',
    category: 'herbicides',
    categoryLabel: 'HERBICIDES',
    group: 'Group 4; Synthetic Auxin',
    formulation: 'SL',
    inStock: true,
    packSizes: ['500 ml', '1 L', '5 L'],
    crops: ['Wheat', 'Maize', 'Sorghum', 'Potato', 'Sugarcane', 'Rice', 'Aquatic Weed Areas', 'Non-Crop Areas'],
    targets: 'Chenopodium, Fumaria, Melilotus, Vicia, Convolvulus, Trianthema, Amaranthus, Cyperus, Digera, Portulaca, Commelina',
    dosage: 'Crop-specific dosage as per label recommendation',
    description: 'Selective systemic herbicide used primarily for broadleaf weed control through synthetic auxin activity.',
    imgSrc: t25
  },

  // 25. CLEANR
  {
    id: 'prod-cleanr',
    name: 'CLEANR',
    brand: 'SHIMANZU',
    chemical: 'Paraquat Dichloride 24% SL',
    category: 'herbicides',
    categoryLabel: 'HERBICIDES',
    group: 'Group 22; Photosystem I Electron Diversion Inhibitor',
    formulation: 'SL',
    inStock: true,
    packSizes: ['500 ml', '1 L', '5 L'],
    crops: ['Tea', 'Potato', 'Cotton', 'Rubber', 'Coffee', 'Rice', 'Wheat', 'Maize', 'Grapes', 'Apple'],
    targets: 'Annual Grasses, Perennial Grasses, Broadleaf Weeds, Sedges',
    dosage: '800–2000 ml/acre depending on crop and application',
    description: 'Fast-acting contact herbicide causing rapid desiccation of green weed tissues and providing broad-spectrum weed control.',
    imgSrc: t27
  },

  // 26. PENOX PLUS
  {
    id: 'prod-penox-plus',
    name: 'PENOX PLUS',
    brand: 'SHIMANZU',
    chemical: 'Penoxsulam 0.97% + Butachlor 38.8% SE',
    category: 'herbicides',
    categoryLabel: 'HERBICIDES',
    group: 'Group 2 + Group 15; ALS Inhibitor + VLCFA Synthesis Inhibitor',
    formulation: 'SE',
    inStock: true,
    packSizes: ['500 ml', '1 L', '2.5 L'],
    crops: ['Transplanted Rice', 'Direct-Seeded Rice'],
    targets: 'Echinochloa colona, Echinochloa crus-galli, Cyperus iria, Cyperus difformis, Marsilea, Alternanthera, Fimbristylis, Monochoria, Ludwigia',
    dosage: '2000 ml/ha',
    description: 'Dual-mode rice herbicide providing broad-spectrum pre- and early-season control of grasses, sedges and broadleaf weeds.',
    imgSrc: t28
  },

  // 27. SHIMANZU 11:11:8
  {
    id: 'prod-shimanzu-11-11-8',
    name: 'SHIMANZU 11:11:8',
    brand: 'SHIMANZU',
    chemical: 'NPK 11:11:8 fortified with Zinc and Boron',
    category: 'at-plant',
    categoryLabel: 'AT-PLANT / FERTILIZERS',
    group: 'NPK + Zinc & Boron Fertilizer',
    formulation: 'Suspension',
    inStock: true,
    packSizes: ['500 ml', '1 L', '5 L'],
    crops: ['Field Crops', 'Horticultural Crops', 'Vegetables', 'Fruits'],
    targets: 'Nutrient Deficiency, Poor Plant Growth, Micronutrient Deficiency',
    dosage: 'Approximately 500–750 ml/acre or 5–7 ml/L, subject to product label',
    description: 'Balanced NPK fertilizer fortified with zinc and boron to support plant nutrition, vegetative growth and overall crop development.',
    imgSrc: t29
  },

  // 28. Ghiroilkona R-111
  {
    id: 'chem-r111',
    name: 'Ghiroilkona R-111',
    brand: 'SHIMANZU JAPAN',
    chemical: 'Titanium Dioxide (TiO₂), Rutile Grade',
    category: 'chemicals',
    categoryLabel: 'INDUSTRIAL CHEMICALS / PIGMENTS',
    group: 'Rutile Titanium Dioxide Pigment - White Opacifying Pigment',
    formulation: 'PW',
    inStock: true,
    packSizes: ['25 Kg', '500 Kg Jumbo'],
    crops: ['Coatings', 'Plastics', 'Paper', 'Printing Inks'],
    targets: 'Whiteness, Brightness, Opacity, Hiding Power',
    dosage: 'Application/formulation dependent',
    description: 'White rutile titanium dioxide pigment used to provide whiteness, brightness, opacity and hiding power in coatings, plastics, paper and printing inks.',
    imgSrc: r111Img
  },

  // 29. Ghiroilkona R-555
  {
    id: 'chem-r555',
    name: 'Ghiroilkona R-555',
    brand: 'SHIMANZU JAPAN',
    chemical: 'Titanium Dioxide (TiO₂), Rutile Grade',
    category: 'chemicals',
    categoryLabel: 'INDUSTRIAL CHEMICALS / PIGMENTS',
    group: 'Rutile Titanium Dioxide Pigment - White Opacifying Pigment',
    formulation: 'PW',
    inStock: true,
    packSizes: ['25 Kg', '500 Kg Jumbo'],
    crops: ['Industrial Formulations', 'Plastics', 'Paints', 'Masterbatch'],
    targets: 'Whiteness, Brightness, Opacity, Light-scattering',
    description: 'Rutile-grade white pigment providing whiteness, brightness, opacity and light-scattering/hiding properties for industrial formulations.',
    imgSrc: r555Img
  },

  // 30. Ghiroilkona R-777
  {
    id: 'chem-r777',
    name: 'Ghiroilkona R-777',
    brand: 'SHIMANZU JAPAN',
    chemical: 'Titanium Dioxide (TiO₂), Rutile Grade',
    category: 'chemicals',
    categoryLabel: 'INDUSTRIAL CHEMICALS / PIGMENTS',
    group: 'Rutile Titanium Dioxide Pigment - White Opacifying Pigment',
    formulation: 'PW',
    inStock: true,
    packSizes: ['25 Kg', '500 Kg Jumbo'],
    crops: ['Coatings', 'Plastics', 'Paper', 'Inks', 'Masterbatch'],
    targets: 'High weather resistance, maximum opacity, chemical stability, UV shielding',
    dosage: 'Application/formulation dependent',
    description: 'Rutile TiO₂ pigment used to improve whiteness, brightness, opacity and hiding power in coatings, plastics, paper and inks.',
    imgSrc: r777Img
  },

  // 31. Ghiroilkona R-999
  {
    id: 'chem-r999',
    name: 'Ghiroilkona R-999',
    brand: 'SHIMANZU JAPAN',
    chemical: 'Titanium Dioxide (TiO₂), Rutile Grade',
    category: 'chemicals',
    categoryLabel: 'INDUSTRIAL CHEMICALS / PIGMENTS',
    group: 'Rutile Titanium Dioxide Pigment - White Opacifying Pigment',
    formulation: 'PW',
    inStock: true,
    packSizes: ['25 Kg', '500 Kg Jumbo'],
    crops: ['Industrial Applications', 'Coatings', 'Engineering Plastics'],
    targets: 'High whiteness, brightness, opacity and hiding power',
    dosage: 'Application/formulation dependent',
    description: 'White rutile titanium dioxide pigment intended to provide high whiteness, brightness, opacity and hiding power in industrial applications.',
    imgSrc: chemicalsImg
  }
];

export const FORMULATIONS = [
  { id: 'SC', label: 'Suspension Concentrate (SC)' },
  { id: 'EC', label: 'Emulsifiable Concentrate (EC)' },
  { id: 'SL', label: 'Soluble Liquid (SL)' },
  { id: 'WG', label: 'Water Dispersible Granules (WG)' },
  { id: 'CS', label: 'Capsule Suspension (CS)' },
  { id: 'FS', label: 'Flowable Concentrate for Seed Treatment (FS)' },
  { id: 'SE', label: 'Suspo-Emulsion (SE)' },
  { id: 'PW', label: 'Powder / Pigment Grade (PW)' },
  { id: 'Suspension', label: 'Suspension Liquid' }
];

export const CROPS_FILTER = [
  'Rice',
  'Cotton',
  'Soybean',
  'Wheat',
  'Maize',
  'Chilli',
  'Tomato',
  'Potato',
  'Groundnut',
  'Mango',
  'Grapes',
  'Onion',
  'Tea',
  'Sugarcane'
];
