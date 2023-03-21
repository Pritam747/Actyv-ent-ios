import { IonContent, IonPage } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import Header from '../components/Header';
import './Page.css';

const Page: React.FC = () => {

  const { modName } = useParams<{ modName: string; }>();

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
        <ExploreContainer compName={modName}/>
      </IonContent>
    </IonPage>
  );
};

export default Page;
