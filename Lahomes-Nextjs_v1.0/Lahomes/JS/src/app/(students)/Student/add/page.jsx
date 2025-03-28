

import PageTitle from '@/components/PageTitle';
import AddStudent from './components/AddStudent';
import { Col, Row } from 'react-bootstrap';

export const metadata = {
  title: 'Customers Add'
};

const CustomerAddPage = () => {
  return <>
     <PageTitle subName="Student" title="Add Student" />
      <Row>
       
        <Col xl={9} lg={12}>
          <AddStudent/>
        </Col>
      </Row>
    </>;
};

export default CustomerAddPage;