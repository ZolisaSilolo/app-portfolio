import { PageScenery } from './PageScenery';

/**
 * Home page background below the hero: Johannesburg night skyline flowing
 * into a misty rainforest (Agumbe, India; CC0 via Wikimedia Commons).
 */
export const HomeScenery = () => (
  <PageScenery
    top={{ src: '/joburg-skyline-night.jpg', tone: 'night', position: 'center 65%' }}
    bottom={{ src: '/rainforest-agumbe.jpg', tone: 'day' }}
  />
);
