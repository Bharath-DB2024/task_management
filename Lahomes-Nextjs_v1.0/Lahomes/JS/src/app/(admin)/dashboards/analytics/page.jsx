import PageTitle from '@/components/PageTitle';
import { Row } from 'react-bootstrap';

import SalesChart from './components/SalesChart';

import Statistics from './components/Statistics';




export const metadata = {
  title: 'Analytics'
};
const AnalyticsPage = () => {
  return <>
      <PageTitle title="Admin" subName="Dashboard" />
      <Statistics />
      <Row>
        <SalesChart />

      </Row>
    
    </>;
};
export default AnalyticsPage;