import PageTitle from '@/components/PageTitle';
import { Row } from 'react-bootstrap';
import BalanceCard from './components/BalanceCard';
import SalesChart from './components/SalesChart';
import SocialSource from './components/SocialSource';
import Statistics from './components/Statistics';
import Transaction from './components/Transaction';



export const metadata = {
  title: 'Analytics'
};
const AnalyticsPage = () => {
  return <>
      <PageTitle title="Student" subName="Dashboard" />
      <Statistics />
      <Row>
      
        <BalanceCard />

      </Row>
    
    </>;
};
export default AnalyticsPage;