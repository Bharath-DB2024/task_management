
import PageTitle from '@/components/PageTitle';
import { Col, Row } from 'react-bootstrap';
import AddInstructor from './components/AddInstructor';

export const metadata = {
  title: 'Add Agent'
};

const AgentAddPage = () => {

  return <>
      <PageTitle  title="Add Instructor" />
      <Row >
        <Col xl={12} lg={8}  >
       
          <AddInstructor />
       
        </Col>
      </Row>
    </>;
};

export default AgentAddPage;