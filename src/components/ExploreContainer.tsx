import './ExploreContainer.css';
import { useTranslation } from "react-i18next";

interface ContainerProps {
  compName: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ compName }) => {
  const { t } = useTranslation();
  return (
    <div className="container">
      <strong>{compName} </strong>
      <p>{t('EXPLORE')} <a target="_blank" rel="noopener noreferrer" href={process.env.REACT_APP_UI_COMPONENTS}>{t('UI_COMPONENTS')}</a></p>
    </div>
  );
};

export default ExploreContainer;
