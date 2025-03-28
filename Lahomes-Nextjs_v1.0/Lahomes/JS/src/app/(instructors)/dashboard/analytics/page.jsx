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
      <PageTitle title="Instructor" subName="Dashboard" />
      <Statistics />
      <Row>
        {/* <SalesChart /> */}
        <BalanceCard />
      </Row>
    
    </>;
};
export default AnalyticsPage;