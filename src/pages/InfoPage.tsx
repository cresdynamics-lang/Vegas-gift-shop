import { Link } from 'react-router-dom';
import InfoPageLayout from '../components/InfoPageLayout';
import { INFO_PAGES } from '../data/infoPages';
import AboutPage from './info/AboutPage';
import ShippingPage from './info/ShippingPage';
import ReturnsPage from './info/ReturnsPage';

const CUSTOM_PAGES: Record<string, () => JSX.Element> = {
  about: AboutPage,
  shipping: ShippingPage,
  returns: ReturnsPage,
};

interface InfoPageProps {
  pageId: string;
}

const InfoPage = ({ pageId }: InfoPageProps) => {
  const Custom = CUSTOM_PAGES[pageId];
  if (Custom) return <Custom />;

  const content = INFO_PAGES[pageId];
  if (!content) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page not found</h1>
        <Link to="/" className="text-red-600 font-semibold hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const plainLayout = pageId === 'contact' || pageId === 'privacy' || pageId === 'terms' || pageId === 'faq';

  return (
    <InfoPageLayout
      content={content}
      plain={plainLayout}
      accent={pageId === 'privacy' || pageId === 'terms' ? 'gray' : 'red'}
    />
  );
};

export default InfoPage;
