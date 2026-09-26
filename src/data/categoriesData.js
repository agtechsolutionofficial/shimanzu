import fungicidesImg from '../assets/images/categories/fungicides.jpg';
import herbicidesImg from '../assets/images/categories/herbicides.jpg';
import insecticidesImg from '../assets/images/categories/insecticides.jpg';
import atplantImg from '../assets/images/categories/at-plant.jpg';
import harvestAidsImg from '../assets/images/categories/harvest-aids.jpg';
import precisionImg from '../assets/images/categories/precision-platforms.jpg';
import chemicalsImg from '../assets/images/categories/chemicals.jpg';

export const CATEGORIES = [
  {
    id: 'chemicals',
    name: 'CHEMICALS',
    shortName: 'Chemicals',
    accentColor: '#1E40AF', // Deep Blue accent bar
    image: chemicalsImg,
    description: 'Explore our high-purity chemical technicals, titanium dioxide rutile pigments, and specialty industrial formulations.',
    fullDescription: 'High-purity chemical technicals, titanium dioxide rutile grade pigments, specialty industrial additives, and advanced chemical intermediates manufactured with Japanese precision.',
    productCount: 3,
  },
  {
    id: 'fungicides',
    name: 'FUNGICIDES',
    shortName: 'Fungicides',
    accentColor: '#0D9488', // Teal accent bar
    image: fungicidesImg,
    description: 'Learn more about our best-in-class selection of fungicides, many with proprietary active ingredients.',
    fullDescription: 'Our fungicide portfolio provides broad-spectrum and systemic control against destructive plant pathogens, powdery mildew, blast, blights, and rusts, protecting plant vitality from root to leaf.',
    productCount: 4,
  },
  {
    id: 'herbicides',
    name: 'HERBICIDES',
    shortName: 'Herbicides',
    accentColor: '#15803D', // Forest Green accent bar
    image: herbicidesImg,
    description: 'Clean fields improve your yield potential. Our herbicides are formulated to help you control the toughest, most resistant weeds in a wide variety of crops. From preemergence and postemergence control to convenient harvest aids, FMC puts you in charge of your season.',
    fullDescription: 'Clean fields improve your yield potential. Formulated to suppress invasive grass, sedges, and broadleaf weeds in paddy, cotton, soybean, maize, and pulses with superior crop safety.',
    productCount: 4,
  },
  {
    id: 'insecticides',
    name: 'INSECTICIDES & MITICIDES',
    shortName: 'Insecticides & Miticides',
    accentColor: '#7C3AED', // Purple accent bar
    image: insecticidesImg,
    description: 'View our insecticide and miticide offerings featuring innovative chemistries for superior control.',
    fullDescription: 'Engineered with advanced chemistries that target chewing and sucking pests, borer complexes, aphids, thrips, and mites while preserving beneficial predatory insects.',
    productCount: 4,
  },
  {
    id: 'at-plant',
    name: 'AT-PLANT',
    shortName: 'At-Plant Technologies',
    accentColor: '#EA580C', // Amber/Orange accent bar
    image: atplantImg,
    description: 'View our leading At-Plant technologies designed to protect your input investments from the start.',
    fullDescription: 'Protect crops right from seedling emergence with root-zone bio-stimulants, seed dressers, and soil health restorers that unlock early vigor and robust disease resilience.',
    productCount: 4,
  },
  {
    id: 'harvest-aids',
    name: 'HARVEST AIDS',
    shortName: 'Harvest Aids',
    accentColor: '#0F766E', // Forest Teal accent bar
    image: harvestAidsImg,
    description: 'See our tools developed to support an easier, more efficient harvest.',
    fullDescription: 'Uniform maturation defoliants, crop desiccants, and harvest conditioners designed to accelerate harvesting schedules, reduce moisture content, and maximize grade quality.',
    productCount: 3,
  },
  {
    id: 'precision-platforms',
    name: 'PRECISION PLATFORMS',
    shortName: 'Precision Platforms',
    accentColor: '#1E3A8A', // Deep Blue accent bar
    image: precisionImg,
    description: 'Read more about our proprietary technologies transforming crop protection application.',
    fullDescription: 'Next-generation bio-stimulants, nano-adjuvants, drone-compatible formulations, and foliar nutrition technologies designed to maximize chemical efficacy and minimize environmental footprint.',
    productCount: 4,
  }
];
